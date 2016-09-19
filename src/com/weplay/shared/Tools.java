package com.weplay.shared;


import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.text.DateFormat;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class Tools {
	public static final Logger log = Logger.getLogger(Tools.class.getName());

	public static final String ADMIN_EMAIL = "shifumixwww@gmail.com";
    public static final String DOMAIN = "https://shifumixweb.appspot.com";

    private static String sep_champs=",";
	private static String sep_enreg="sepenreg";
	public static String char_perso="_";

    public static String encrypt(String password, String key){
        try
        {
            Key clef = new SecretKeySpec(key.getBytes("ISO-8859-2"),"Blowfish");
            Cipher cipher=Cipher.getInstance("Blowfish");
            cipher.init(Cipher.ENCRYPT_MODE,clef);
            return new String(cipher.doFinal(password.getBytes()));
        }
        catch (Exception e)
        {
            return null;
        }
    }


    public static double distance(double lat_a, double lon_a, double lat_b, double lon_b) {
        if(lat_a==lat_b & lon_a==lon_b)return 0.0;
        double a = Math.PI / 180;
        double lat1 = lat_a * a;
        double lat2 = lat_b * a;
        double lon1 = lon_a * a;
        double lon2 = lon_b * a;

        double t1 = Math.sin(lat1) * Math.sin(lat2);
        double t2 = Math.cos(lat1) * Math.cos(lat2);
        double t3 = Math.cos(lon1 - lon2);
        double t4 = t2 * t3;
        double t5 = t1 + t4;
        double rad_dist = Math.atan(-t5/Math.sqrt(-t5 * t5 +1)) + 2 * Math.atan(1);

        return (rad_dist * 3437.74677 * 1.1508) * 1609.3470878864446;
    }

	public static long defaultValidityDelay=200L*24L*3600L*1000L; //200 jours de validity pour les parser
	
	public static String convertStreamToString(InputStream is) {
	    java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
	    return s.hasNext() ? s.next() : "";
	}
	
	public static byte[] convertStreamToByte(java.io.InputStream is) {
		ByteArrayOutputStream buffer = new ByteArrayOutputStream();

		int nRead;
		byte[] data = new byte[106384];

		try {
			while ((nRead = is.read(data, 0, data.length)) != -1) {
			  buffer.write(data, 0, nRead);
			}
			buffer.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return buffer.toByteArray();
	}
	
	
	
	public static String washString(String str){
		/**
		 * @TODO inclure ici une fonction de netoyage des chaines de caract�re 
		 */
		str=str.replaceAll("  ", " ").trim().replaceAll(sep_champs, "").replaceAll(sep_enreg, "").trim();
		str=str.replaceAll("\n", "").replaceAll("\r", "").replaceAll(":", "").replaceAll("<", "").replaceAll(">", "");
		str=str.replaceAll("%", "");
		return(str);
	}

	/**
	 * Extraction des chaines de caracteres
	 * @param str chaine a d�couper
	 * @param start debut de la d�coupe
	 * @param end fin de la d�coupe
	 * @param toLowerCase pr�cise si l'on tient compte de la casse pour trouver les chaines
	 * @return la chaine comprise entre "start" et "end"
	 */
	public static String extract(String str,String start,String end,Boolean toLowerCase){
		if(str==null)return null;
		int i=0,j=str.length();
		if(toLowerCase)
			i=str.toLowerCase().indexOf(start.toLowerCase())+start.length();
		else
			i=str.indexOf(start)+start.length();
		
		if(i<start.length())i=0;
		
		if(end.length()>0){
			if(toLowerCase)
				j=str.toLowerCase().indexOf(end.toLowerCase(),i);
			else
				j=str.indexOf(end,i);
			
			if(j==-1)j=str.length();
		}	
		return(str.substring(i,j));
	}
	
	public static String ampute(String s,int fromStart,int fromEnd){
		return s.substring(fromStart, s.length()-fromEnd);
	}

	protected String remove(String str,String start,String end){
		int i=str.indexOf(start)+start.length();if(i<start.length())i=0;
		int j=str.indexOf(end,i);if(j==0)j=str.length()-1;
		return(str.substring(0, i)+str.subSequence(j, str.length()-1));
	}
	
	/**
	 * Traitement des messages mime
	 * @param message
	 * @return
	 */
	public ArrayList<String> getDocuments(MimeMessage message) {
	
		String s=null;
		ArrayList<String> rc=new ArrayList<String>(); 
		try {
			//log.warning("Message de type : "+message.getContentType());
			Object o=message.getContent();
			
			if (o instanceof Multipart) {
				Multipart m = (Multipart) o;
				for(int i=0;i<m.getCount();i++){
					Part part=m.getBodyPart(i);
					s+=m.getBodyPart(i).getContent().toString();
					
					String disposition = part.getDisposition();
					if (disposition != null && (disposition.equals(Part.ATTACHMENT) || disposition.equals(Part.INLINE))){
						String file=new Scanner(part.getInputStream(),"UTF-8").next();
						log.warning("File size="+file.length()+" content:"+part.getContentType());
						rc.add(file);
					}
				}
				
				rc.add(s);
			}

            if(o instanceof InputStream){
				s=new Scanner((InputStream) o,"Cp1252").useDelimiter("\\A").next();
			}
			
			if(o instanceof String){
				s=(String) o;
			}
			
			
		} catch (MessagingException | IOException e) {
			e.printStackTrace();
		}
			
		return rc;
	}
	
	
	
	

	public static String compile(String ens1, String ens2) {
		String rc=ens1;
		for(String elt:ens2.split(sep_champs))
			if(!rc.contains(elt))rc+=elt+sep_champs;
		
		return rc.substring(0,rc.length()-sep_champs.length());
	}
	

	public static boolean chkMail(String email){
		if(email!=null)
			if(email.contains("@") && !email.startsWith("@") && email.endsWith(".com"))return(true);
		return false;
	}
	
	/**
	 * Recherche une adresse email dans un corps de email
	 * TODO � tester
	 * @see http://imss-www.upmf-grenoble.fr/prevert/Prog/Java/CoursJava/expressionsRegulieres.html  
	 * @see http://www.regxlib.com/DisplayPatterns.aspx?cattabindex=0&categoryId=1
	 * 
	 * @param s
	 * @return la liste des email trouver dans le document
	 */
	public static List<String> findMail(String s){
		
		ArrayList<String> rc=new ArrayList<String>();
		s=" "+s.replaceAll("<", " ").replaceAll(">", " ").toLowerCase()+" ";
		s=s.replaceAll("\"", "").replaceAll("\"", "");
		/*
		String mailRegex = "([a-z0-9_]|\\-|\\.)+@(([a-z0-9_]|\\-)+\\.)+[a-z]{2,4}";
		//String mailRegex = "^[_a-z0-9-]+(\\.[_a-z0-9-]+)*@[a-z0-9-]+(\\.[a-z0-9-]+)+$";
		
		
		
		
		Pattern p = Pattern.compile(mailRegex);
		Matcher m = p.matcher(s);
		if( m.matches())
			   for(int i= 0; i<= m.groupCount(); ++i){
				   String adresse=m.group(i);
				   if(adresse!=null && adresse.contains("@"))rc.add(adresse);
			   }
		
		if(rc.size()==0){
			log.severe("Aucun adresse email trouv� dans "+s);
		}
		
		return rc;
		
		*/
		try{
			int i=0,j,k;
			String cars=" <>";
			while(i>-1){
				i=s.indexOf("@",i+1);
				if(i>-1){
					for(j=i-1;j>=0;j--){
						String ch=s.substring(j,j+1);
						if(cars.indexOf(ch)>-1){
							for(k=i+1;k<s.length();k++)
								if(cars.indexOf(s.substring(k,k+1))>-1){
									rc.add(s.substring(j+1,k).toLowerCase());
									i=k+1;
									break;
								}
							break;
						}
							
					}	
				}
			}
		}catch (Exception e){
			log.severe(e.getMessage()+" : Impossible de trouver les mails dans "+s);
		}
		
		
		return rc;
	}
	
	/*vrai si A est inclu dans B
	public static boolean estDans(List<Info> A,List<Info> B){
		for(Info i:A)
			if(!i.estDans(B,true))return false;
		
		return true;
	}*/

	

	
	public static String getDate(Long dt) {
		if(dt==null)dt=new Date().getTime();
		GregorianCalendar calendar = new GregorianCalendar();
		DateFormat formatter = DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT, Locale.FRANCE);
		TimeZone timeZone = TimeZone.getTimeZone("CST");
		formatter.setTimeZone(timeZone);
		
		return formatter.format(dt);
	}

	public static String generatePassword() {    
		return UUID.randomUUID().toString().substring(0,6);
	}

	public static Long  getFromNow(int i) {
		return new Date().getTime()-i*24*3600*1000-30*365*24*3600*1000;
	}

	


	

	/**
	 * Supprime les contenu entre guillement
	 * Cette fonction est utilis� pour d�tecter les variables dans un script de parser
	 * @param s
	 * @return
	 */
	public static String removeString(String s) {
		Pattern reg=Pattern.compile("\".*\"");
		Matcher matcher=reg.matcher(s);
		while(matcher.find()){
			s=s.replaceAll(matcher.group(), "");
		}
		return s;
	}



	/**
	 * Retourne la difference entre deux date en heure

	 * @return diff�rence entre deux date en heure
	 */
	private static Long dateDiff(Long d1, Long d2) {
		if(d1==null)d1=0L;
		if(d2==null)d2=0L;
        return Math.abs(d1-d2)/(3600*1000);
	}

	public static String traduit(String s,String lang){
		String dic="Aug=Ao�t,Jan=Janvier,Feb=F�vrier,Mar=Mars,March=Mars,Apr=Avril,Avr=Avril,May=Mai,Jui=Juin,Jul=Juillet,Sep=Septembre,Oct=Octobre,Nov=Novembre,Dec=D�cembre";
		for(String mot:dic.split(","))
			s=s.replaceAll("-"+mot.split("=")[0]+"-", "-"+mot.split("=")[1]+"-");
		
		return s;
	}



	/**
	 * Retourne le nombre de jours depuis l'extraction de la date
	 * @param dtMesure
	 * @return
	 */
	public static long getDelay(Long dtMesure) {
		return (dateDiff(System.currentTimeMillis(),dtMesure))/24;
	}



	/**
	 * Distance entre points exprim�s en degr�s
	 * @param lat1
	 * @param lon1
	 * @param lat2
	 * @param lon2
	 * @param unit
	 * @return distance entre les points de lat1,lon1 et lat2,lon2
	 */
	public static double distance(double lat1, double lon1, double lat2, double lon2, char unit) {
		  double theta = lon1 - lon2;
		  double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
		  dist = Math.acos(dist);
		  dist = rad2deg(dist);
		  dist = dist * 60 * 1.1515;
		  if (unit == 'K') {
		    dist = dist * 1.609344;
		  } else if (unit == 'N') {
		  	dist = dist * 0.8684;
		    }
		  return (dist);
		}

		/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
		/*::  This function converts decimal degrees to radians             :*/
		/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
		private static double deg2rad(double deg) {
		  return (deg * Math.PI / 180.0);
		}

		/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
		/*::  This function converts radians to decimal degrees             :*/
		/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
		private static double rad2deg(double rad) {
		  return (rad * 180.0 / Math.PI);
		}
	

}
