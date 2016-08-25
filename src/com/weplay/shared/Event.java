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

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;


/**
 * Cette classe permet de stocker le r�sultat du parsing HTML
 * 
 * @see 
 * @author Herv� Hoareau
 *
 */
@Entity
@Cache
public class Event implements Comparable<Event>,Serializable {
	protected static final Logger log = Logger.getLogger(Event.class.getName());
	
	@Id public String Id="event"+System.currentTimeMillis(); 													//Id interne des messages
	@Index
    public Long dtStart;

    @Index
    public Long dtEnd;

    public boolean opened=true;		//Indique si l'evt est ouvert au non invit�
	private String title="";
	private String logo="";
    private String description="";
    private String website=null;
	public String ipAdresse=null;
	private String facebook_event;
	public String password=null;


    public List<String> orders=new ArrayList<>();

    private Boolean needLoc=false;

    @Index
    private String owner=null;
	private Integer maxOnline=50;
	private String flyer="";


	private List<String> playlist=new ArrayList<String>();
	public List<String> Invites=new ArrayList<String>();				
	public List<String> Presents=new ArrayList<String>();
    public Song currentSong=null;

	public Long lastSave=0L;	//Date du dernier message post�

	public Double distanceFromUser;

    public Double lat=0.0;
    public Double lng=0.0;

    public Integer scoreInvite=5;
    private Integer scoreLikeSong=1;
    public Integer scorePostSong=-2;
    public Integer scoreStart=10;
    public Integer minScore=-20;
    public Integer scorePlaySong=2;
    private Integer playlistLimits=20;
    public Integer minDistance=1000;
    private String order="";


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
		this.owner=owner;
		if(password!=null && password.length()>0)this.password=password;
		this.lat=lat;
        this.lng=lng;
	}

    public Event(String title, User own) {
        this.dtStart=System.currentTimeMillis();
        this.dtEnd=this.dtStart+3600*1000;
        this.title=title;
        this.lat=48.0;
        this.lng=2.0;
        this.owner=own.email;

    }



	public boolean addSong(Song song){
		song.idEvent=this.getId();
        for(String s:this.playlist)
			if(s!=null && s.equals(song.text))return false;

		this.playlist.add(song.text);
        addOrder("playlist");
		return true;
	}




    public void sendInvite(String dests,String from){
        for(String dest:dests.split(";")){
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);
            try {
                javax.mail.Message msg = new MimeMessage(session);
                msg.setFrom(new InternetAddress(Tools.ADMIN_EMAIL));
                msg.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(dest));
                msg.setSubject("Invitation for " + this.title);
                msg.setText("Dear, Open "+Tools.DOMAIN+"/index.html?event="+this.getId()+"&from="+from+" to join the event");
                Transport.send(msg);
            } catch (AddressException e) {
                e.printStackTrace();
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }


	@Override
	public int compareTo(Event o) {
		if(o.distanceFromUser<this.distanceFromUser)
			return -1;
		else
			return 1;
	}

	
	public void addInvited(User u) {
		if(!this.Invites.contains(u.email)){
            addOrder("addinvited");
            this.Invites.add(u.email);
        }

	}

	public boolean addPresents(User u) {
		if(!this.Presents.contains(u.email)){
			this.Presents.add(u.email);
            addOrder("adduser");
            u.currentEvent=this.Id;
        }

        return true;


	}

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Song getCurrentSong() {
        return currentSong;
    }

    public void setCurrentSong(Song currentSong) {
        this.currentSong = currentSong;
    }

    public boolean delPresents(User u) {
		if(this.Presents.contains(u.email)){
			this.Presents.remove(u.email);
			u.currentEvent=null;
			return true;
		}
		
		return false;
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

    public Boolean getNeedLoc() {
        return needLoc;
    }

    public void setNeedLoc(Boolean needLoc) {
        this.needLoc = needLoc;
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

    public String getFlyer() {
        return flyer;
    }

    public void setFlyer(String flyer) {
        this.flyer = flyer;
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

    public Integer getScoreInvite() {
        return scoreInvite;
    }

    public void setScoreInvite(Integer scoreInvite) {
        this.scoreInvite = scoreInvite;
    }

    public Integer getScoreLikeSong() {
        return scoreLikeSong;
    }

    public void setScoreLikeSong(Integer scoreLikeSong) {
        this.scoreLikeSong = scoreLikeSong;
    }

    public Integer getScorePostSong() {
        return scorePostSong;
    }

    public void setScorePostSong(Integer scorePostSong) {
        this.scorePostSong = scorePostSong;
    }

    public Integer getScoreStart() {
        return scoreStart;
    }

    public void setScoreStart(Integer scoreStart) {
        this.scoreStart = scoreStart;
    }

    public Integer getMinScore() {
        return minScore;
    }

    public void setMinScore(Integer minScore) {
        this.minScore = minScore;
    }

    public Integer getScorePlaySong() {
        return scorePlaySong;
    }

    public void setScorePlaySong(Integer scorePlaySong) {
        this.scorePlaySong = scorePlaySong;
    }

    public Integer getPlaylistLimits() {
        return playlistLimits;
    }

    public void setPlaylistLimits(Integer playlistLimits) {
        this.playlistLimits = playlistLimits;
    }

    public Integer getMinDistance() {
        return minDistance;
    }

    public void setMinDistance(Integer minDistance) {
        this.minDistance = minDistance;
    }



    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public void addOrder(String order) {
        List<String> nw = new ArrayList<>();
        for (String s : this.orders) {
            if (s.indexOf(order) == -1) {
                int k = 0;
                for (k = 0; k < nw.size(); k++) {
                    String dt1 = nw.get(k).replace("{\"dtOrder\":", "").split(",")[0];
                    String dt2 = s.replace("{\"dtOrder\":", "").split(",")[0];
                    if (Long.parseLong(dt1) < Long.parseLong(dt2)) break;
                }
                nw.add(k, s);
            }
        }
        this.orders=nw;
        this.orders.add(0,"{\"dtOrder\":"+System.currentTimeMillis()+",\"order\":\""+order.toLowerCase()+"\"}");
    }

    public List<String> getOrders() {
        return orders;
    }

    public void setOrders(List<String> orders) {
        this.orders = orders;
    }

    public List<String> getPlaylist() {
        return playlist;
    }

    public void setPlaylist(List<String> playlist) {
        this.playlist = playlist;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
}


