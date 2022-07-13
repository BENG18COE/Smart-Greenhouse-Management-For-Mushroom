#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "DHT.h"
#include <Servo.h>
#include <ArduinoJson.h>

#define DHTPIN A3
#define DHTTYPE DHT22 
#define TANK_FULL "high"
#define TANK_MID "mid"
#define TANK_LOW "low"

Servo servo;
LiquidCrystal_I2C lcd(0x27,16,2);
DHT dht(DHTPIN, DHTTYPE);

uint32_t delayMS;
int soil_wetness = 0;
String tank_level = "";
int temperature = 0, humidity = 0;
bool irrigation_was_started = false, fan_started = false, window_opened = false, auto_fan = false, auto_window = false, 
     auto_irrigation = false;
const int pump = 12, moisture_sensor = A2, fan = 13, tank_low_pin = A0,
          tank_full_pin = A1, buzzer = 8, default_angle = 0, max_angle = 150;
int current_angle = default_angle;
unsigned long upload_t, controls_t;

void truncate(String* str, int columns) {
  *str = str->substring(0, columns);
}
void print_lcd(String str, int row) {
  static const int COLUMNS = 16;
  if (str.length() > COLUMNS) truncate(&str, COLUMNS);
  int pre_spaces = (COLUMNS - str.length()) / 2;
  lcd.setCursor(0, row); lcd.print("                ");
  lcd.setCursor(pre_spaces, row); lcd.print(str);
}
void print_lcd(String str0, String str1) {
  static const int COLUMNS = 16;
  if (str0.length() > COLUMNS) truncate(&str0, COLUMNS);
  if (str1.length() > COLUMNS) truncate(&str1, COLUMNS);
  int pre_spaces0 = (COLUMNS - str0.length()) / 2;
  int pre_spaces1 = (COLUMNS - str1.length()) / 2;
  lcd.clear();
  lcd.setCursor(pre_spaces0, 0); lcd.print(str0);
  lcd.setCursor(pre_spaces1, 1); lcd.print(str1);
}
void default_lcd_text() {
  print_lcd("Interactive IoT","Greenhouse");
}
void get_temp_hum() {  
  humidity = dht.readHumidity();
  temperature = dht.readTemperature();
  if (isnan(temperature)) temperature = 0;
  if (isnan(humidity)) humidity = 0;
}
bool soil_is_wet() {
  if(digitalRead(moisture_sensor)) return false;
  return true;
}
void get_water_level() {
  if(!digitalRead(tank_full_pin)) tank_level =  TANK_FULL;
  else if(digitalRead(tank_low_pin)) tank_level = TANK_LOW;
  else tank_level = TANK_MID;
  delay(1000);
}
String read_ph() {
  int a = analogRead(6);
  return a <  512 ? " nan" : "ovf";
}
void display_parameters(String p) {
  String row0 = "temp: " + (String)temperature + " C";
  String row1 = "hum: " + (String)humidity + " %RH";
  print_lcd(row0, row1);
  delay(2000);
  print_lcd("ph: " + p, "");
  delay(700);
}
void start_irrigation() {
  if(!irrigation_was_started) {
    // print_lcd("starting","soil irrigation");;
    // delay(1000);
    digitalWrite(pump, 1);
    delay(1000);
    irrigation_was_started = true;
  }
  else {
    // print_lcd("irrigation is","going on");
    // delay(2000);
  }
}
void stop_irrigation() {
  if(irrigation_was_started) {
    print_lcd("stopping","irrigation");
    delay(1000);
    digitalWrite(pump,0);
    delay(1000);
    irrigation_was_started = false;
  }
  else {
    // print_lcd("irrigation is","stopped");
    // delay(2000);
  }
}
void fan_on() {
  if(!fan_started) {
    // print_lcd("starting","fan");
    digitalWrite(fan, 1);
    delay(1400);
    fan_started = true;
  }
  else {
    // print_lcd("fan is on","");
    // delay(1400);
  }
}
void fan_off() {
  if(fan_started) {
    print_lcd("turning fan","OFF now");
    digitalWrite(fan, 0);
    delay(1400);
    fan_started = false;
  }
  else {
    // print_lcd("fan is OFF","");
    // delay(1400);
  }
}
void open_window() {
  if(window_opened); // print_lcd("window is"," open");
  else {
    // print_lcd("opening","window");
    for(; current_angle < max_angle; current_angle++) {
      servo.write(current_angle);
      delay(20);
    }
    window_opened = true;
  }
}
void close_window() {
  if(window_opened) {
    // print_lcd("closing","window");
    for(; current_angle > default_angle; current_angle--) {
      servo.write(current_angle);
      delay(20);
    }
    window_opened = false;
  }
  // else print_lcd("window is","closed");
}
bool temperature_too_high() {
  static const float max_temperature = 40;
  return temperature > max_temperature;
  return false;
}
bool humidity_too_high() {
  static const float max_humidity = 80;
  return humidity > max_humidity;
  return false;
}
void beep_buzzer(int n, int on_time, int off_time) {
  for(int i = 0; i < n; i++) {
    tone(buzzer, 1000);
    delay(on_time);
    noTone(buzzer);
    delay(off_time);
  }
} 
void get_controls() {
  while(Serial.available()) Serial.read();
  print_lcd("requesting","");
  String url = "https://jaylinenyambea.herokuapp.com/getcontrols";
  lcd.setCursor(0,1);
  Serial.println(url);
  int timeout = 12000;
  unsigned long t = millis();
  while(millis() - t < timeout & !Serial.available()){
    lcd.print(".");
    delay(timeout / 16);
  }
  if(Serial.available()) {
    String response = Serial.readStringUntil('\r');
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(response);
    if(root.success()) {
      String type = root["_id"];
      int irr = root["irrigation"];
      int win = root["window"];
      int fn = root["fan"];
      if(type == "controls") {
        // print_lcd("data request","success");
        // delay(1400);
        if(irr == 1) {
          auto_irrigation = true;
          start_irrigation();
        }
        else if(irr == 0) {
          auto_irrigation = false;
          // stop_irrigation();
        }
        if(win == 1) {
          auto_window = true;
          open_window();
        }
        else if(win == 0) {
          auto_window = false;
          // close_window();
        }
        if(fn == 1) {
          auto_fan = true;
          fan_on();
        }
        else if(fn == 0) {
          auto_fan = false;
          // fan_off();
        }
      }
      // else print_lcd("corrupt response","");
    }
    // else print_lcd("failed","");
    // delay(2000);
  }
  else {
    // print_lcd("WiFi module","unresponsive");
    // delay(2000);
  }
}
void upload_data() {
  while(Serial.available()) Serial.read();
  print_lcd("uploading data","");
  // String url = "https://jaylinenyambea.herokuapp.com/adddata?level=" + tank_level + "&temperature=" + String(temperature) + 
  //               "&humidity=" + String(humidity) + "&moisture=" + String(soil_wetness);
  lcd.setCursor(0,1);
  // Serial.println(url);
  Serial.println("https://jaylinenyambea.herokuapp.com/adddata?level=" + tank_level + "&temperature=" + String(temperature) + 
                "&humidity=" + String(humidity) + "&moisture=" + String(soil_wetness));
  int timeout = 12000;
  unsigned long t = millis();
  while(millis() - t < timeout & !Serial.available()){
    lcd.print(".");
    delay(timeout / 16);
  }
  if(Serial.available()) {
    String response = Serial.readStringUntil('\r');
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(response);
    if(root.success()) {
      String u_temperature = root["temperature"];
      String u_humidity = root["humidity"];
      String u_level = root["level"];
      String u_moisture = root["moisture"];
      if(temperature == u_temperature.toInt() & humidity == u_humidity.toInt() & tank_level == u_level & 
        soil_wetness == u_moisture.toInt()) {
        print_lcd("successfully","uploaded data");
      }
      else print_lcd("corrupt response","from server");
    }
    else print_lcd("couldnt upload","data");
    delay(2000);
  }
  else {
    print_lcd("WiFi module","is not responding");
    delay(2000);
  }
}
void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(pump, OUTPUT);
  pinMode(fan, OUTPUT);
  pinMode(moisture_sensor, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(tank_low_pin, INPUT);
  pinMode(tank_full_pin, INPUT);
  servo.attach(9);
  servo.write(current_angle);
  // fan_on(); start_irrigation(); while(1); delay(3000); fan_off(); stop_irrigation(); while(1);
  lcd.init();
  lcd.backlight();
  default_lcd_text();
  beep_buzzer(1, 1500, 0);
  upload_t = millis();
  controls_t = millis();
}
void loop() {
  String ph_value = read_ph();
  get_temp_hum();
  get_water_level();
  display_parameters(ph_value);
  if(millis() - upload_t > 20000) {
    // Serial.println("uploading");
    upload_data();
    upload_t = millis();
  } 
  if(!soil_is_wet()) {  //if soil is dry
    beep_buzzer(1, 500, 0);
    start_irrigation();
    soil_wetness = 0;
  }
  else {  //soil is wet
    if(auto_irrigation) start_irrigation(); //auto irrigation always turns irrigation on
    else stop_irrigation();
    soil_wetness = 1;
  }
  // Serial.println(soil_wetness);
  if(temperature_too_high()) {
    beep_buzzer(2, 300, 100);
    fan_on();
  }
  else {
    if(auto_fan) fan_on();
    else fan_off();
  }
  if(humidity_too_high()) {
    beep_buzzer(3, 300, 100);
    open_window();
  }
  else {
    if(auto_window) open_window();
    else close_window();
  }
  if(millis() - controls_t > 10000) {
    get_controls();
    controls_t = millis();
  }
}
