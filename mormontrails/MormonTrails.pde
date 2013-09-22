/* @pjs preload="data/USA_MAP_smaller.jpg"; */

function lineDistance( x1, y1, x2, y2 )
{
  var xs = x2 - x1;
  xs = xs * xs;
 
  var ys = y2 - y1;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

var month_names = [];
month_names[month_names.length] = "Jan";
month_names[month_names.length] = "Feb";
month_names[month_names.length] = "Mar";
month_names[month_names.length] = "Apr";
month_names[month_names.length] = "May";
month_names[month_names.length] = "Jun";
month_names[month_names.length] = "Jul";
month_names[month_names.length] = "Aug";
month_names[month_names.length] = "Sept";
month_names[month_names.length] = "Oct";
month_names[month_names.length] = "Nov";
month_names[month_names.length] = "Dec";

function dateFormat(date) {
    return '' + month_names[date.getMonth()] + '. ' + date.getFullYear();
}

PImage usmap;
PFont small;
PFont large;

final int WIDTH = 800;
final int HEIGHT = 432;

final float slcLatitude = 40.75238;
final float slcLongitude = -111.87669;
float slcX;
float slcY;

float minLatitude = 24.49331;
float maxLatitude = 49.67201;
float minLongitude = -125.54369;
float maxLongitude = -66.39330;
//java.util.Date minDate = null;
//java.util.Date maxDate = null;
var minDate = null;
var maxDate = null;
int minIndividuals = 10000000;
int maxIndividuals = 0;

// slider vars
double secondsPerYear;
//java.util.Date beginScale;
//java.util.Date endScale;
var beginScale, endScale;

int paddingSides = 0;
int paddingBottom = 30;
int sliderHeight = 40;
int left = paddingSides;
int right;
int top;
int bottom;
int trackLeft;
int trackRight;
int trackTop;
float thumb;

float pctTime = 0f;
float perFrameIncrement = 0.001f;
boolean autorun = false;

float listX = 30;
float listY = 30;
float listYincrement = 20;
float curListY;

Company[] companies;

boolean record = false;

void setup()
{
  // this causes an incorrect applet size
  //size(WIDTH, HEIGHT);
  size(800, 432);
  
  large = createFont("Georgia", 24, true);
  small = createFont("Georgia", 10, true);
  
  // See http://viewer.nationalmap.gov/viewer/?p=default&b=base3&x=-10365185.449108005&y=4623664.928263873&l=5&v=govunit%3A18%3B16
  usmap = loadImage("data/USA_MAP_smaller.jpg");
  
  slcX = map(slcLongitude, minLongitude, maxLongitude, 0, width);
  slcY = height - map(slcLatitude, minLatitude, maxLatitude, 0, height) + 20;
  
  String[] lines = loadStrings("data/companies.tsv");
  
  // initialize the companies
  companies = new Company[lines.length - 1];
  for(int i = 1; i < lines.length; i++)
  {
    String[] tokens = splitTokens(lines[i], "\t");
    companies[i - 1] = InitCompany(tokens);
    
    if(minDate == null)
    {
     minDate = companies[i-1].departure;
    }
    
    if(maxDate == null)
    {
      maxDate = companies[i-1].arrival;
    }
    
    if(minDate > companies[i - 1].departure)
    {
       minDate = companies[i-1].departure; 
    }
    
    if(maxDate < companies[i-1].arrival)
    {
       maxDate = companies[i-1].arrival; 
    }
    
    minIndividuals = min(minIndividuals, companies[i - 1].individuals);
    maxIndividuals = max(maxIndividuals, companies[i - 1].individuals);
  }
  
  secondsPerYear = 60 * 60 * 24 * 365.25;
  beginScale = new Date(minDate);
  endScale = new Date(maxDate);
  
  beginScale.setMonth(0);
  beginScale.setDate(1);
  endScale.setMonth(0);
  endScale.setDate(1);
  endScale.setFullYear(endScale.getFullYear() + 1);
  
  right = width - paddingSides;
  top = height - sliderHeight - paddingBottom;
  bottom = height - paddingBottom;
  trackLeft = left + 20;
  trackRight = right - 20;
  trackTop = top + 15;
  println("minDate="  + minDate + "  secondsPerYear=" + str(secondsPerYear) + "  beginScale=" + beginScale);
  println("beginScale: " + beginScale + " minDate: " + minDate + "  maxDate: " + maxDate + "  endScale: " + endScale);
  smooth();
  
  background(255);
}

void draw()
{
  image(usmap, 0, 0);
  
  curListY = listY;
  thumb = map(pctTime, 0.0, 1.0, trackLeft, trackRight);
  drawDepartureCities();
  drawSlider();
  
  if(autorun)
  {
   pctTime += perFrameIncrement; 
   
   if(pctTime > 1.0f)
   {
     if(record)
    { 
      mm.finish();
    }
     autorun = false;
   }
   else
   {
     if(record)
     {
       mm.addFrame();
     }
   }
  }
}

void keyPressed()
{
  autorun = !autorun;
}

void mousePressed()
{
  println("mouseX=" + mouseX + " thumb=" + thumb + "    mouseY=" + mouseY + "  top=" + top + "  sliderheight=" + sliderHeight);
  if(mouseX > trackLeft && mouseX < trackRight && mouseY > top && mouseY < (top + sliderHeight))
  {
     autorun = false;
     pctTime = map(min(max(mouseX, trackLeft), trackRight), trackLeft, trackRight, 0.0, 1.0);
  }
}

void mouseDragged()
{
  if(mouseX > trackLeft && mouseX < trackRight && mouseY > top && mouseY < (top + sliderHeight))
  {
     autorun = false;
     pctTime = map(min(max(mouseX, trackLeft), trackRight), trackLeft, trackRight, 0.0, 1.0);
  }
}

Company InitCompany(String[] tokens)
{
    Company company = null;
    try
    {
      company = new Company(tokens[0], Date.parse(tokens[1]), float(tokens[2]), float(tokens[3]), Date.parse(tokens[4]), tokens[5], tokens[6], int(tokens[7]), tokens[8]);
    }
    catch(Exception e)
    {
      println(e);
    }
    
    company.x1 = map(company.longitude, minLongitude, maxLongitude, 0, WIDTH);
    company.y1 = HEIGHT - map(company.latitude, minLatitude, maxLatitude, 0, HEIGHT) + 20;
    company.x2 = slcX;
    company.y2 = slcY;
    
    Float cx1;
    Float cy1;
    Float cx2;
    Float cy2;
    
    // generate a semi-random set of control points for the company
    Float dx = slcX - company.x1;
    Float dy = slcY - company.y1;
    cx1 = company.x1 + (dx * 0.2);
    cx2 = company.x1 + (dx * 0.8);
    cy1 = company.y1 + (dy * 0.2);
    cy2 = company.y1 + (dy * 0.8);
    
    if(abs(dx) > abs(dy))
    {
       Float adj = random(-abs(dx * 0.15), abs(dx * 0.15));
       cy1 += adj;
       cy2 += adj;
    }
    else
    {
       Float adj = random(-abs(dy * 0.15), abs(dy * 0.15));
       cx1 += adj;
       cx2 += adj;
    }
    
    company.cx1 = cx1;
    company.cy1 = cy1;
    company.cx2 = cx2;
    company.cy2 = cy2;
    
    return company;
}

void drawDepartureCities()
{
  float curDateFloat = map(pctTime, 0.0f, 1.0f, beginScale.getTime(), endScale.getTime());
  var curDate = new Date(curDateFloat);
  
  // draw overall thumb time label
  textAlign(RIGHT);
  textFont(large);
  fill(248, 242, 230, 150);
  text(dateFormat(curDate), width - 59, 42);
  fill(97, 75, 24);
  text(dateFormat(curDate), width - 60, 40);
  
  
  ArrayList traveling = new ArrayList();
  
  ArrayList annotations = new ArrayList();
  var companyPt = null;
  
  for(int i = 0; i < companies.length; i++)
  {
    // set the stroke weight to reflect the number of travelers in the company
    strokeWeight(round(map(companies[i].individuals, minIndividuals, maxIndividuals, 1, 10)));
    
    float companyPct = 0;
    if(curDate.getTime() > companies[i].departure && curDate.getTime() < companies[i].arrival)
    {
      // this company is currently traveling
      stroke(176, 44, 22);
      companyPct = map(curDate.getTime(), companies[i].departure, companies[i].arrival, 0.0, 1.0); 
      traveling.add(companies[i]);
    }
    else if(curDate.getTime() > companies[i].arrival)
    {
      // this company has arrived
      stroke(248, 242, 230, 150);
      companyPct = 1.0; 
    }
    else
    {
      // this company hasn't departed yet
      stroke(97, 75, 24);
      point(companies[i].x1, companies[i].y1); 
    }
    
    if(drawBezier(companies[i].x1, companies[i].y1, companies[i].cx1, companies[i].cy1, companies[i].cx2, companies[i].cy2, companies[i].x2, companies[i].y2, companyPct, traveling.size()))
    {
      annotations.add(companies[i]);
    }
  }
  
  int idx = 0;
  int annotationHeight = 40;
  for(Company company : annotations)
  {
    // print the company info
    fill(97, 75, 24);
    textSize(20);
    textAlign(LEFT);
    text(company.name, listX, listY + (annotationHeight * idx));
    textSize(12);
    text("departed " + company.city + ", " + company.state + " in " + dateFormat(new Date(company.departure)), listX + 10, listY + (annotationHeight * idx) +15);
    
    idx++;
  }
  /*
  if(traveling.size() > 0)
  {
    rectMode(CORNERS);
    strokeWeight(2);
    stroke(200, 200, 200, 200);
    fill(255, 255, 255, 220);
    rect(listX - 5, listY - 15, listX + 340, listY + ((traveling.size() - 1) * listYincrement)  + 5);
  }
  
  idx = 1;
  for(Company company : traveling)
  {
    // draw a city label
    textAlign(CENTER);
    textSize(12);
    fill(0, 0, 0);
    text(company.city, company.x1, company.y1); 
    
    // print the company info
    // draw a label
    stroke(0);
    strokeWeight(20);
    point(listX + 5, curListY - 5);
    stroke(255);
    strokeWeight(17);
    point(listX + 5, curListY - 5);
    fill(0);
    textSize(10);
    textAlign(CENTER);
    text(str(idx), listX + 5, curListY);
    
    textAlign(LEFT);
    text(company.name, listX + 20, curListY);
    curListY += listYincrement;
    
    idx++;
  }
  */
}

boolean drawBezier(float x1, float y1, float cx1, float cy1, float cx2, float cy2, float x2, float y2, float pct, int idx)
{
  boolean underMouse = false;
  
  if(pct <= 0)
  {
    // just draw a point
    point(x1, y1); 
  }
  else if( pct >= 1.0)
  {
    // we can draw the whole bezier
    noFill();
    beginShape();
    vertex(x1, y1);
    bezierVertex(cx1, cy1, cx2, cy2, x2, y2);
    endShape();
  }
  else
  {
    // we've got to do the math to draw a partial bezier
    
    // variables for intermediate points
    Float _cx1;
    Float _cy1;
    Float _cx2;
    Float _cy2;
    Float _x2;
    Float _y2;
    
    // calculate the intermediate controls based on the time (0 to 1.0)
    _cx1 = x1 + (pct * (cx1 - x1));
    _cy1 = y1 + (pct * (cy1 - y1));
    _cx2 = cx1 + (pct * (cx2 - cx1));
    _cy2 = cy1 + (pct * (cy2 - cy1));
    
    _cx2 = _cx1 + (_cx2 - _cx1) * pct;
    _cy2 = _cy1 + (_cy2 - _cy1) * pct;
    
    // calculate the point along the final bezier
    // using the equation at http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Quadratic_B.C3.A9zier_curves
    _x2 = pow((1 - pct), 3) * x1 + 3 * pow((1 - pct), 2) * pct * cx1 + 3 * (1 - pct) * pow(pct, 2) * cx2 + pow(pct, 3) * x2;
    _y2 = pow((1 - pct), 3) * y1 + 3 * pow((1 - pct), 2) * pct * cy1 + 3 * (1 - pct) * pow(pct, 2) * cy2 + pow(pct, 3) * y2;  
    
    
    // draw the partial bezier
    noFill();
    beginShape();
    vertex(x1, y1);
    bezierVertex(_cx1, _cy1, _cx2, _cy2, _x2, _y2);
    endShape();
    
    // draw a label
    strokeWeight(20);
    point(_x2, _y2);
    stroke(255);
    strokeWeight(17);
    point(_x2, _y2);
    fill(0);
    textSize(10);
    textAlign(CENTER);
    text(str(idx), _x2, _y2 + 4);
    
    underMouse = lineDistance(mouseX, mouseY, _x2, _y2) < 12;
  }
  
  return underMouse;
}


void drawSlider()
{
  // draw slider track
  strokeWeight(2);
  stroke(248, 242, 230);
  fill(248, 242, 230, 150);
  rectMode(CORNERS);
  rect(left, top, right, bottom);
  

  // draw slider
  stroke(50, 50, 50, 200);
  fill(200, 200, 200, 200);
  strokeWeight(5);
  line(trackLeft, trackTop, trackRight, trackTop);
  
  var tick = new Date(beginScale.getTime());
  var stop = new Date(endScale.getTime());
  stop.setDate(stop.getDate() + 1);
  
  
  // draw ticks
  strokeWeight(1);
  while(tick < stop)
  {
    float x = map(tick.getTime(), beginScale.getTime(), endScale.getTime(), trackLeft, trackRight);
    //println(df.format(tick) + " = " + x);
    stroke(50, 50, 50, 200);
    fill(200, 200, 200, 200);
    line(x, trackTop - 10, x, trackTop + 14);
    
    if(abs(tick.getYear() % 2) == 1)
    {
      // draw tick labels
      fill(0);
      textAlign(CENTER);
      textFont(small);
      text(tick.getFullYear(), x, trackTop + 20);
    }
    tick.setFullYear(tick.getFullYear() + 1);
  }
  
  // draw the thumb
  strokeWeight(15);
  stroke(255, 0, 0, 200);
  point(thumb, trackTop + 10);
  strokeWeight(3);
  line(thumb, trackTop - 10, thumb, trackTop + 10);
  stroke(255);
  strokeWeight(7);
  point(thumb, trackTop + 10);
  
  // draw leaps
  strokeWeight(1);
  stroke(200, 0, 0, 100);
  for(int i = 0; i < companies.length; i++)
  {
    float x1 = map(companies[i].departure, beginScale.getTime(), endScale.getTime(), trackLeft, trackRight);
    float x2 = map(companies[i].arrival, beginScale.getTime(), endScale.getTime(), trackLeft, trackRight);
    float c = x1 + (x2 - x1) / 2;
    
    drawBezier(x1, trackTop, c, trackTop - 10, c, trackTop - 10, x2, trackTop, 1.0, 0);
  }
}

