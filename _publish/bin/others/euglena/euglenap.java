import java.applet.Applet;
import java.awt.*;
import java.awt.image.*;
import java.awt.event.*;
class Aktualisierer extends Thread{
  euglenap ea;
  boolean aktiv;
  public Aktualisierer(euglenap eap){ ea=eap;aktiv=false;}
  public void run(){
    aktiv=true;
    while (true){
//      ea.repaint(0,0,500,500);
      ea.paint(ea.getGraphics());  
      try {
        sleep(100);
      } catch (InterruptedException e){
        System.out.println("Timerfehler");
      }
    }
  }
}
class Point2D{
  double x,y=0;

  Point2D(){}
  Point2D(double x, double y){this.x=x;this.y=y;}
  public static Point2D middle (Point2D p1,Point2D p2){
    return new Point2D((p1.x+p2.x)/2,(p1.y+p2.y)/2);
  }
  public int iX(){
    return (int)x;
  }
  public int iY(){
    return (int)y;
  }
  public double getLänge(){
    return Math.sqrt(x*x+y*y);
  }
  public Point2D setLänge(double newLänge){ 
    double laenge=getLänge();
    return new Point2D((x/laenge)*newLänge,(y/laenge)*newLänge);
  }  
  public Point2D rotate(double rot){ 
//    if (Math.abs(rot)>0.00000001)
      return new Point2D(x*Math.cos(rot)+y*Math.sin(rot),y*Math.cos(rot)-x*Math.sin(rot));

  }
  public Point2D add(Point2D point){
    return new Point2D(this.x+point.x,this.y+point.y);
  }
  public double distance(Point2D point){
    return new Point2D(this.x-point.x,this.y-point.y).getLänge();
  }
  public Point2D sub(Point2D point){
    return new Point2D(this.x-point.x,this.y-point.y);
  }
  public Point2D div(int wert){
    return new Point2D(this.x/wert,this.y/wert);
  }
  public double skalarprodukt(Point2D point){  
     return (this.x*point.x+this.y*point.y);
  }
}
class BezierKurven{

public static void bezier(Graphics g, Point2D pos, Point2D P0, Point2D P1,
      Point2D P2, Point2D P3)

   {  double x0 = P0.x, y0 = P0.y,
          x3 = P3.x, y3 = P3.y;
      if (Math.abs(x0 - x3) <= 2 && Math.abs(y0 - y3) <= 2)  {
         g.drawLine(P0.iX()+pos.iX(), P0.iY()+pos.iY(), P3.iX()+pos.iX(), P3.iY()+pos.iY());
      }else
      {  Point2D A = Point2D.middle(P0, P1), B = Point2D.middle(P3, P2),
            C = Point2D.middle(P1, P2), A1 = Point2D.middle(A, C),
            B1 = Point2D.middle(B, C), C1 = Point2D.middle(A1, B1);
         bezier(g,pos, P0, A, A1, C1);
         bezier(g,pos, C1, B1, B, P3);
      }
   }
}


class Euglena{
  Point2D pos=new Point2D(0,0);
  double rotation;
  double newrotation,goodrot=rotation;
  int verschiebung=1;
  int geiselpos;
  Lebensraum lraum=null;
  public void paint(Graphics g){
    int tgei=geiselpos>20?40-geiselpos:geiselpos;

    Point2D endepos=new Point2D(20,20);
    endepos=endepos.rotate((Math.PI/8)*(((double)(geiselpos<21?geiselpos:40-geiselpos)-10)/10));
  
    Point2D kurzpos=endepos.setLänge(15);    
    Point2D m2pos=endepos.rotate(Math.PI/2).setLänge((10-tgei)).add(kurzpos);
    kurzpos=endepos.setLänge(10);    
    Point2D m3pos=endepos.rotate(-Math.PI/2).setLänge((10-tgei)).add(kurzpos);

    int[] xpos={   2,   5,-  2,-  7,- 17,- 12,- 5,  2};
    int[] ypos={   0,-  4,- 12,- 14,- 20,- 4,   5,  0} ;
    xpos[1]-=(int)(tgei/2);ypos[1]+=(int)(tgei/2);
    xpos[2]-=(int)(tgei/2);ypos[2]+=(int)(tgei/2);
    xpos[3]-=(int)(tgei/2.55);ypos[3]+=(int)(tgei/2.55);

    xpos[5]+=(int)(tgei/2);ypos[5]-=(int)(tgei/2);
    xpos[6]+=(int)(tgei/2);ypos[6]-=(int)(tgei/2);


    Point2D temp=new Point2D();
    Point2D looknormale=endepos.rotate(-Math.PI/2);
    for (int i=0;i<xpos.length;i++){
      temp.x=xpos[i];temp.y=ypos[i];
      temp=temp.rotate(rotation).add(pos);
      xpos[i]=(int)temp.x;
      ypos[i]=(int)temp.y;
    }
    g.setColor(new Color(4,100,4));
    g.drawPolyline(xpos,ypos,xpos.length);
    g.setColor(new Color(4,154,4));
    g.fillPolygon(xpos,ypos,xpos.length);
    g.setColor(new Color(100,180,255));
    g.fillRect((int)(pos.x-2),((int)pos.y-2),4,4);

    g.setColor(Color.black);


    BezierKurven.bezier(g,pos,
       new Point2D (0,-3).rotate(rotation), 
       m2pos.rotate(rotation),
       m3pos.rotate(rotation),
       endepos.rotate(rotation));
    temp=new Point2D(-3,-2).rotate(rotation).add(pos);
    g.drawLine((int)temp.x,(int)temp.y,(int)pos.x,(int)pos.y);

    if (lraum.PulsierendeVaküle.checked){
      g.setColor(Color.lightGray);
      m2pos=new Point2D(-6+tgei/2.8,1-tgei/2.8).rotate(rotation).add(pos);
      g.fillOval((int)(m2pos.x),(int)(m2pos.y),2+((tgei/2)%3)/2,2+((tgei/2)%3)/2);
    }
    g.setColor(Color.red);
    m2pos=new Point2D(+2-tgei/2.8,-4+tgei/2.8).rotate(rotation).add(pos);
    g.drawRect((int)(m2pos.x),(int)(m2pos.y),1,1);
 if (lraum.SchattenDarstellen.checked){
    //if (liqui!=null){
   temp=lraum.liqui.pos.add(new Point2D(20,20)).sub(m2pos).setLänge(-6).add(m2pos); 
     // temp=temp.setLänge(-6).add(m2pos);
//temp.add(pos);
       g.setColor(Color.lightGray);
       g.drawLine(m2pos.iX(),m2pos.iY(),temp.iX(),temp.iY());
       g.drawLine(m2pos.iX()+1,m2pos.iY()+1,temp.iX()+1,temp.iY()+1);    
       g.drawLine(m2pos.iX()+2,m2pos.iY()+2,temp.iX()+2,temp.iY()+2);    
       g.drawLine(m2pos.iX()+1,m2pos.iY(),temp.iX()+1,temp.iY());    
       g.drawLine(m2pos.iX(),m2pos.iY()+1,temp.iX(),temp.iY()+1);    
/*       if ((tgei<5)||(tgei>12) && (temp.distance(pos)<1.5 || m2pos.distance(pos)<1.5 || (temp.add(m2pos).div(2).distance(pos)<1.5))){
         g.fillRect(200,200,100,100); 
           if (tgei<10){ rotation+=Math.PI/16;} else {rotation-=Math.PI/16;}
       }*/
}
if (!false){
   temp=lraum.liqui.pos.add(new Point2D(20,20)).sub(pos); 
       Point2D temp2=new Point2D(1,0).rotate(rotation-Math.PI/4+Math.PI/2 );
       g.setColor(Color.red);
     if (pos.distance(lraum.liqui.pos.add(new Point2D(20,20)))>40){   
    //   if (lraum.liqui.verschoben){
         double winkel=Math.abs(Math.acos(temp.skalarprodukt(temp2)/(temp.getLänge()*temp2.getLänge())))%Math.PI/2;
        // if (winkel<Math.PI/4-0.01 ||  winkel>Math.PI/4+0.01){
//           if (winkel<Math.PI/4){
             if (tgei<9 /*&& Math.abs(rotation-newrotation)<Math.PI/64*/) 
               rotation+=(Math.PI/70+((winkel<Math.PI/4-0.1)?Math.PI/64:0));
   //        } else {                                                 
             if (tgei>13 /*&& Math.abs(rotation-newrotation)<Math.PI/64*/)  
               rotation-=(Math.PI/70+((winkel>Math.PI/4+0.1)?Math.PI/64:0));
     //      }}
      //   } else { 
      //     goodrot=rotation;  
       //    liqui.verschoben=false;
       //  }
 // if (rotation>goodrot){rotation-=0.06;}else{rotation+=0.06;}
//   rotation=goodrot;
      // } else {
       /*  if (Math.abs(rotation-goodrot)>0.1) 
           verschiebung=-verschiebung;
         if (verschiebung<0){
           if (tgei>12)
             rotation-=0.03;
         } else {
           if (tgei<9)
             rotation+=0.03;
         }*/
     //  }
       this.geiselpos=this.geiselpos<40?this.geiselpos+1:1;
       pos=pos.add(new Point2D(1,0).rotate(rotation-Math.PI/4).setLänge(1));
     }
   }
  g.setColor(Color.black);
  //g.drawString(new Integer(tgei).toString(),2,210);
  g.drawString("Dieses Applet zeigt die Bewegung von Euglena zur Lichtquelle.",2,310);
  g.drawString("Die gelbe Lichtquelle läst sich mit der Maus verschieben.",2,325);
  g.drawString("Hinweis: Sowohl Euglena als auch die Lichtquelle wurden vereinfacht dargestellt.",2,340);
/*  g.drawString("entspricht die Bewegung nicht genau der der echten Euglenen, unteranderem weil",2,355);
  g.drawString("die simulierte Fläche nur 2 Dimensional ist und ein verdrehen des gesamten Körpers ",2,370);
  g.drawString("von der Geschwindigkeit her kaum machbar ist.",2,385);*/
  //g.drawString(new Boolean(liqui.verschoben).toString(),2,85);
  }
}
class Lichtquelle{
   Point2D pos=new Point2D();
   boolean aktiv=false;
   int mx,my;
   boolean verschoben=true; 
   public static Image hintergrund;
  // public static Image =new BufferedImage(400,400,BufferedImage.TYPE_4BYTE_ABGR);
   Lichtquelle(){hintergrund=euglenap.applet.createImage(400,400);}
   public void paint(Graphics g){
     g.drawImage(hintergrund,0,0,null);
   }
   public void OnDown(int x,int y){
     if (x>pos.x && y>pos.y && x<pos.x+40 && y<pos.y+40){
       mx=x-pos.iX();
       my=y-pos.iY();
       aktiv=true;
     }
   }
   public void OnUp(int x,int y){
     aktiv=false;
     verschoben=false;
       Image neuerHintergrund=euglenap.applet.createImage(400,400);
       Graphics g=neuerHintergrund.getGraphics();
       g.setColor(new Color(50,130,205));
       g.fillRect(0,0,500,500);
       for (int i=50;i>0;i--){ 
         g.setColor(new Color(100-i,180-i,255-i));
         g.fillOval(pos.iX()-4*i,pos.iY()-4*i,40+8*i,40+8*i);
       }
       g.setColor(Color.yellow);
       g.fillOval(pos.iX(),pos.iY(),40,40);
       hintergrund.getGraphics().drawImage(neuerHintergrund,0,0,null);
   }
   public void OnDrag(int x,int y){
     if (aktiv){
       pos.x=x-mx;pos.y=y-my;
       verschoben=true;
       Image neuerHintergrund=euglenap.applet.createImage(400,400);
       Graphics g=neuerHintergrund.getGraphics();
/*       for (int i=50;i>0;i--){ 
         g.setColor(new Color(100-i,180-i,255-i));
         g.fillOval(pos.iX()-4*i,pos.iY()-4*i,40+8*i,40+8*i);
       }*/
       g.setColor(new Color(180,180,0));
       g.fillOval(pos.iX(),pos.iY(),40,40);
       hintergrund.getGraphics().drawImage(neuerHintergrund,0,0,null);
     }
   }
}
class EuglenaCheck{
  public boolean checked,aktiv=false;
  public int x,y=300;
  public String text="";
  public void paint(Graphics g){
    if (!aktiv) 
      g.setColor(Color.white);
     else
      g.setColor(Color.lightGray);
    g.fillRect(x-1,y-1,12,12);
    g.setColor(Color.white);
    g.drawRect(x-1,y-1,12,12);
    g.setColor(Color.lightGray);
    g.drawRect(x,y,10,10);
//    g.drawRect(x,y,11,11);
    g.setColor(Color.gray);
    g.drawLine(x-1,y-1,x+10,y-1);
    g.drawLine(x-1,y-1,x-1,y+10);
    g.setColor(Color.black);
    g.drawLine(x,y,x+9,y);
    g.drawLine(x,y,x,y+9);
    if (checked){
      g.drawLine(x+2,y+4,x+4,y+6);
      g.drawLine(x+2,y+5,x+4,y+7);
      g.drawLine(x+2,y+6,x+4,y+8);
                                  
      g.drawLine(x+4,y+6,x+8,y+2);
      g.drawLine(x+4,y+7,x+8,y+3);
      g.drawLine(x+4,y+8,x+8,y+4);
    }
    g.drawString(text,x+18,y+10 );
  }
   public void OnDown(int x,int y){
     if (x>this.x && y>this.y && x<this.x+10 && y<this.y+10){
       aktiv=true;
     }
   }
   public void OnUp(int x,int y){
     if (x>this.x && y>this.y && x<this.x+10 && y<this.y+10) {
       checked=!checked;
     }
     aktiv=false;
   }
}
class Lebensraum /*extends Component*/{
  Euglena euglena;
  Lichtquelle liqui;
  EuglenaCheck SchattenDarstellen;
  EuglenaCheck PulsierendeVaküle;
  Image buffer=euglenap.applet.createImage(400,400);
  Graphics bufgra=buffer.getGraphics();
  public Lebensraum(){
    liqui=new Lichtquelle();
    liqui.pos.x=250;
    liqui.pos.y=250;
    euglena=new Euglena();
    euglena.pos.x=50;
    euglena.rotation=0;
    euglena.pos.y=50;
    euglena.geiselpos=1;
    euglena.lraum=this;
    SchattenDarstellen=new  EuglenaCheck();
    SchattenDarstellen.x=10;
    SchattenDarstellen.y=350;
    SchattenDarstellen.text="Vom Augenfleck geworfenen Schatten darstellen";
    SchattenDarstellen.checked=true;
    PulsierendeVaküle=new  EuglenaCheck();
    PulsierendeVaküle.x=10;
    PulsierendeVaküle.y=365;
    PulsierendeVaküle.text="Pulsierende Vakuole darstellen";
    liqui.OnUp(0,0);
  }   
  public void paint(Graphics g){
    g.drawImage(buffer,0,0,null);
    liqui.paint(bufgra);
    SchattenDarstellen.paint(bufgra); 
    PulsierendeVaküle.paint(bufgra);
//g.fillRect(0,0,400,400);
    euglena.paint(bufgra);
    g.drawImage(buffer,0,0,null);
  }
  public void mousePressed(MouseEvent e){
    liqui.OnDown(e.getX(),e.getY());
    SchattenDarstellen.OnDown(e.getX(),e.getY());
    PulsierendeVaküle.OnDown(e.getX(),e.getY());
  }
  public void mouseReleased(MouseEvent e){
    liqui.OnUp(e.getX(),e.getY());
    SchattenDarstellen.OnUp(e.getX(),e.getY());
    PulsierendeVaküle.OnUp(e.getX(),e.getY());
  }
  public void mouseDragged(MouseEvent e){
    liqui.OnDrag(e.getX(),e.getY());
  }
}
public class euglenap extends Applet{ 
  Lebensraum lr;
  Aktualisierer a;
  public static euglenap applet;
  public void init(){ 
    applet=this;
    resize(555,555);
    lr=new Lebensraum();
    a=new Aktualisierer(this); 
    setBackground(new Color(50,130,205));
    addMouseListener(new MouseAdapter(){
      public void mousePressed(MouseEvent e){
        lr.mousePressed(e);
      }
      public void mouseReleased(MouseEvent e){
        lr.mouseReleased(e);
    }});
    addKeyListener(new KeyAdapter(){
      public void keyPressed(KeyEvent e){
        switch (e.getKeyCode()){  
          
          case KeyEvent.VK_A: lr.euglena.rotation-=Math.PI/32; break;
          case KeyEvent.VK_D: lr.euglena.rotation+=Math.PI/32; break;
          case KeyEvent.VK_W: lr.euglena.pos= lr.euglena.pos.add(new Point2D(1,0).rotate( lr.euglena.rotation-Math.PI/4).setLänge(3));; break;
          case KeyEvent.VK_S: lr.euglena.pos= lr.euglena.pos.sub(new Point2D(1,0).rotate( lr.euglena.rotation-Math.PI/4).setLänge(3));; break;
        } 
      }
    });
    addMouseMotionListener(new MouseMotionAdapter(){
      public void mouseDragged(MouseEvent e){
        lr.mouseDragged(e);
    }});
  }
  public void start(){
      a.start(); 
  }
  public void paint(Graphics g){
     lr.paint(g);

//    g.drawString(new Integer(eu1.geiselpos).toString(),10,10);
  }
}
