/*
 * Copyright (C) 2012 SFR API - Herv� Hoareau

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

package com.weplay.shared;

import com.google.appengine.labs.repackaged.com.google.common.io.BaseEncoding;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.ArrayList;
import java.util.logging.Logger;

/**
 * Cette classe permet de stocker le r�sultat du parsing HTML
 * @see 
 * @author Herv� Hoareau
 *
 */
@Entity
@Cache
public class User implements Comparable<User> {
	protected static final Logger log = Logger.getLogger(User.class.getName());
	
	@Id public String email; 					//Id interne des Users (adresse mail)
	
	public String name="";						//Nom du User	
	private String facebookid=null;
	private String firstname;
    private String humeur;
    public String ip=null;
	public String photo=null;
	private String state="";
    public Boolean anonymous=false;
	
	public String currentEvent="";
	
	public Double lg=null;
	public Double lat=null;
	
	private ArrayList<Vote> votes=new ArrayList<Vote>();
	//public ArrayList<Demande> demandes=new ArrayList<Demande>();

	public Integer score=0;

	private Long dtLastPosition;
    private String home;
    private String picture="";

    String encrypt(String password, String key){
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

    public User(String email,String name,String facebookid,String photo){
		this.email=email.toLowerCase();
		if(name==null || name.length()==0)
			this.name=email.split("@")[0];
		else
			this.name=name;
		
		this.setFacebookId(facebookid);
		if(photo!=null && photo.length()>0)this.photo=photo;
	}

    void initUser(infoFacebook infos) {
        if(infos.email!=null) {
            String s=encrypt(infos.email, "hh4271");
            //this.email = URLEncoder.encode(encrypt(infos.email, "hh4271"), StandardCharsets.US_ASCII.toString());
            this.email= BaseEncoding.base64().encode(s.getBytes());
        }
        else
            this.email = infos.id;

        this.facebookid=infos.id;
        this.firstname = infos.first_name;
        this.photo = infos.link;
        this.home = "https://www.facebook.com/" + infos.id;
        this.picture=infos.picture;

    }

    public User(infoFacebook i) {
        initUser(i);
    }


    public User(String email) {
        initUser(new infoFacebook(email));
    }



    /**
	 * Fixe la position de l'utilisateur
	 * @param lg
	 * @param lat
	 */
	public void setPosition(Double lg,Double lat){
		this.lg=lg;
		this.lat=lat;
		this.dtLastPosition=System.currentTimeMillis();
	}
	
	

	
	public User(){}




	/**
	 * Format destin� au mail ou page web
	 * @return
	 */
	public String toMail(){
		return("bonjour "+name+"\n Votre email enregistre est le "+email+" \n");
	}

	@Override
	public int compareTo(User o) {
		if(o.score>this.score)
			return -1;
		else
			return 1;
	}


	public boolean addScore(Vote v) {
		if(!this.votes.contains(v)){
			this.score+=v.score;		
			this.votes.add(v);
			return true;
		}
		return false;
	}

	

	void setFacebookId(String facebookid) {
		this.facebookid=facebookid;
		if(this.facebookid!=null && facebookid.length()>0 && !facebookid.equals("null"))
			this.photo="https://graph.facebook.com/"+facebookid+"/picture";
		else
			this.photo="personne.png";
	}



    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFacebookid() {
        return facebookid;
    }

    public void setFacebookid(String facebookid) {
        this.facebookid = facebookid;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCurrentEvent() {
        return currentEvent;
    }

    public void setCurrentEvent(String currentEvent) {
        this.currentEvent = currentEvent;
    }

    public Double getLg() {
        return lg;
    }

    public void setLg(Double lg) {
        this.lg = lg;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public ArrayList<Vote> getVotes() {
        return votes;
    }

    public void setVotes(ArrayList<Vote> votes) {
        this.votes = votes;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Long getDtLastPosition() {
        return dtLastPosition;
    }

    public void setDtLastPosition(Long dtLastPosition) {
        this.dtLastPosition = dtLastPosition;
    }

    public String getHome() {
        return home;
    }

    public String getHumeur() {
        return humeur;
    }

    public void setHumeur(String humeur) {
        this.humeur = humeur;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public void setHome(String home) {
        this.home = home;
    }

    public Boolean getAnonymous() {
        return anonymous;
    }

    public void setAnonymous(Boolean anonymous) {
        this.anonymous = anonymous;
    }
}
