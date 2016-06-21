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

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;


/**
 * Cette classe permet de stocker le r�sultat du parsing HTML
 * 
 * @see 
 * @author Herv� Hoareau
 *
 */
@Entity
public class Event implements Comparable<Event>,Serializable {
	protected static final Logger log = Logger.getLogger(Event.class.getName());
	
	@Id public String Id="event"+System.currentTimeMillis(); 													//Id interne des messages
	@Index public Long dtStart;
	@Index public Long dtEnd;

    public boolean opened=true;		//Indique si l'evt est ouvert au non invit�
	public String title="";
	public String logo="";
	public String ipAdresse=null;
	public String facebook_event;
	public String idLieu=null;		//Description de l'endroit
	public String password=null;
	@Index public String owner=null;
	public Integer maxOnline=50;
	public String typeDemandes;
	public String flyer="";
		
	public List<Song> playlist=new ArrayList<Song>();
	public List<String> Invites=new ArrayList<String>();				
	public List<String> Presents=new ArrayList<String>();

	public Long lastSave=0L;	//Date du dernier message post�

	public Double distanceFromUser;

    public Double lat=0.0;
    public Double lng=0.0;

    //@NotSaved public List<User> classement;
	
	public Event(){}
	
	/**
     *
     * @param title titre de l'event
	 * @param place endroit de l'event
	 * @param dtStart date de d�but
	 * @param duration 
	 * @param owner
	 */
	public Event(String title,String password,Lieu place,Long dtStart,int duration,String owner,String typeDemandes,Double lat,Double lng){
		this.dtStart=dtStart;
		this.dtEnd=this.dtStart+duration*3600*1000;
		this.title=title;
		this.idLieu=place.Id;
		this.owner=owner;
		if(password!=null && password.length()>0)this.password=password;
		this.lat=lat;
        this.lng=lng;
		this.typeDemandes=typeDemandes;
	}


	
	public Song getSong(String id){
		for(Song s:playlist)
			if(s.Id.equals(Id))return s;
		
		return null;
	}
	
	public boolean addSong(Song song){
		for(Integer i=0;i<playlist.size();i++){
			Song s=playlist.get(i);
			if(s.Id!=null && s.Id.equals(song.Id)){
				if(song.dtCreate!=s.dtCreate)s.score++;
				playlist.set(i, s);
				return true;
			}
		}
		
		this.playlist.add(song);
		return true;
	}



	@Override
	public int compareTo(Event o) {
		if(o.distanceFromUser<this.distanceFromUser)
			return -1;
		else
			return 1;
	}

	
	public void addInvited(User u) {
		if(!this.Invites.contains(u.email))
			this.Invites.add(u.email);
	}


	public boolean addPresents(User u) {
		if(!this.Presents.contains(u.email)){
			this.Presents.add(u.email);
			u.currentEvent=this.Id;
			return true;
		}
		
		return false;
	}

	public boolean delPresents(User u) {
		if(this.Presents.contains(u.email)){
			this.Presents.remove(u.email);
			u.currentEvent=null;
			return true;
		}
		
		return false;
	}

	public String[] getDemande(int pos){
		String[] s=this.typeDemandes.split("nature=");
		if(pos>s.length)return null;
		
		String[] rc=("nature="+s[pos]).split("\n");
		return rc;
	}
	
	public String getDemande(String nature){
		for(String s:this.typeDemandes.split("nature=")){
			if(s.startsWith(nature)){
				return(s.replace(nature+"\r\n",""));
			}	
		}
		return null;
		
	}


    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }

    public Long getDtStart() {
        return dtStart;
    }

    public void setDtStart(Long dtStart) {
        this.dtStart = dtStart;
    }

    public Long getDtEnd() {
        return dtEnd;
    }

    public void setDtEnd(Long dtEnd) {
        this.dtEnd = dtEnd;
    }

    public boolean isOpened() {
        return opened;
    }

    public void setOpened(boolean opened) {
        this.opened = opened;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getIpAdresse() {
        return ipAdresse;
    }

    public void setIpAdresse(String ipAdresse) {
        this.ipAdresse = ipAdresse;
    }

    public String getFacebook_event() {
        return facebook_event;
    }

    public void setFacebook_event(String facebook_event) {
        this.facebook_event = facebook_event;
    }

    public String getIdLieu() {
        return idLieu;
    }

    public void setIdLieu(String idLieu) {
        this.idLieu = idLieu;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Integer getMaxOnline() {
        return maxOnline;
    }

    public void setMaxOnline(Integer maxOnline) {
        this.maxOnline = maxOnline;
    }

    public String getTypeDemandes() {
        return typeDemandes;
    }

    public void setTypeDemandes(String typeDemandes) {
        this.typeDemandes = typeDemandes;
    }

    public String getFlyer() {
        return flyer;
    }

    public void setFlyer(String flyer) {
        this.flyer = flyer;
    }

    public void setPlaylist(List<Song> playlist) {
        this.playlist = playlist;
    }

    public List<String> getInvites() {
        return Invites;
    }

    public void setInvites(List<String> invites) {
        Invites = invites;
    }

    public List<String> getPresents() {
        return Presents;
    }

    public void setPresents(List<String> presents) {
        Presents = presents;
    }

    public Long getLastSave() {
        return lastSave;
    }

    public void setLastSave(Long lastSave) {
        this.lastSave = lastSave;
    }

    public Double getDistanceFromUser() {
        return distanceFromUser;
    }

    public void setDistanceFromUser(Double distanceFromUser) {
        this.distanceFromUser = distanceFromUser;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }



}


