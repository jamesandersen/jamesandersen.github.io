//import java.util.Date;

class Company {

  String name;
  java.util.Date departure;
  java.util.Date arrival;
  float latitude;
  float longitude;
  String city;
  String state;
  int individuals;
  String linkUrl;
  
  float x1;
  float y1;
  float cx1;
  float cy1;
  float cx2;
  float cy2;
  float x2;
  float y2;


  Company() { }

  Company(String name, Date departure, float latitude, float longitude, Date arrival, String city, String state, int individuals, String linkUrl)
  {
     this.name = name;
     this.departure = departure;
     this.latitude = latitude;
     this.longitude = longitude;
     this.arrival = arrival;
     this.city = city;
     this.state = state;
     this.individuals = individuals;
     this.linkUrl = linkUrl;
  }

}
