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
import com.weplay.server.DAO;

import java.io.Serializable;
import java.util.*;
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
public class Event implements Serializable {
	protected static final Logger log = Logger.getLogger(Event.class.getName());
	
	@Id public String Id="event"+System.currentTimeMillis(); 													//Id interne des messages

    @Index public Long dtStart;
    @Index public Long dtEnd;

    public boolean opened=true;		//Indique si l'evt est ouvert au non invit�
	private String title="";
	private String logo="";
    private String description="";
    private String website=null;
	public String ipAdresse=null;
	private String facebook_event;
	public String password=null;
    public List<Integer> sources=new ArrayList<Integer>();

    public List<String> orders=new ArrayList<>();
    private Boolean needLoc=false;

    private User owner=null;
	private Integer maxOnline=50;
	private String flyer="";

    private Map<String, Double> scores=new Hashtable<>();
    private Map<String,Long> lastUpdate=new Hashtable<String,Long>();

	private List<String> playlist=new ArrayList<String>();
	public List<String> Invites=new ArrayList<String>();				
	public List<User> Presents=new ArrayList<User>();

    public Double sponsor=0.0; //Versement réaliser pour faire remonter l'appli à la une

    public Song currentSong=null;
    public String musicPlayer=null; //Information about the music player
    public Boolean playerHasFocus=false;
    public Boolean needValidate=false;

	public Long lastSave=0L;	//Date du dernier message post�

	//public Double distanceFromUser;

    public Double lat=0.0;
    public Double lng=0.0;

    public Double scoreInvite=5.0;
    private Integer scoreLikeSong=1;
    private Integer scoreVotantlikeSong=1;
    public Double scorePostSong=-1.0;
    public Double scoreStart=0.0;
    public Double scoreMiseBet=1.0;
    public Integer minScore=-20;
    public Double scorePlaySong=2.0;
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
	public Event(String title,String password,Long dtStart,int duration,User owner,String typeDemandes,Double lat,Double lng){
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
        this.owner=own;
        this.minDistance=100000;
    }



	public boolean addSong(Song song){
		song.idEvent=this.getId();
        for(String s:this.playlist)
			if(s!=null && s.equals(song.text))return false;

		this.playlist.add(song.text);
        if(!this.needValidate)song.setValidate(true);

        addOrder("playlist");
		return true;
	}


    protected double distance(double lat_a, double lon_a, double lat_b, double lon_b) {
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
    
    public double distanceFrom(User u){
        Double d= distance(u.getLat(),u.getLng(),this.getLat(),this.getLng());
        return d;
    }


    public void sendInvite(String dests,User from,String shorturl){
        for(String dest:dests.split(";")){
            if(shorturl==null)shorturl=Tools.DOMAIN+"/index.html?event="+this.getId()+"&from="+from.email;
            if(dest.length()>0)
                DAO.sendMail(dest, from.lang, Tools.ADMIN_EMAIL, null,
                        "#join_mail.html", Arrays.asList(this.title,shorturl,this.flyer)
                );
        }
    }

    public void sendCloseMail() {
        DAO.sendMail(this.owner.getEmail(), this.owner.lang,
                Tools.ADMIN_EMAIL,
                null,
                "#end_mail.html",Arrays.asList(this.title,Tools.DOMAIN + "/Views/AllPhotos.html?event=" + this.getId())
        );
    }

    public void sendQuitMail(User u,DAO dao){
            DAO.sendMail(u.getEmail(),u.lang,Tools.ADMIN_EMAIL,
                    null,"#quit_mail.html",
                    Arrays.asList(this.title,this.owner.getFirstname(),this.getHTML(dao)));
    }
	
	
	public Boolean addInvited(User u) {
		if(!this.Invites.contains(u.id)){
            addOrder("addinvited");
            this.Invites.add(u.id);
            return true;
        }
        return false;
	}

    //Add a new user
	public boolean addPresents(User u) {
        if(distanceFrom(u)>this.minDistance && !u.getId().equals(this.getOwner().id)) {
            u.message = "SELEVENT.TOFAR";
            return false;
        }

        if(this.getPresents().contains(u)){
            u.message="SELEVENT.ALREADYPRESENT";
            return false;
        }

        this.Presents.add(u);
        scores.put(u.id,u.score);  //Enregistre le score de l'utilisateur à son entré dans la soirée

        addOrder("adduser");
        u.currentEvent=this.Id;
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
		if(this.Presents.contains(u)){
			this.Presents.remove(u);
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

    public Boolean getNeedValidate() {
        return needValidate;
    }

    public void setNeedValidate(Boolean needValidate) {
        this.needValidate = needValidate;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Double getSponsor() {
        return sponsor;
    }

    public void setSponsor(Double sponsor) {
        this.sponsor = sponsor;
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

    public List<User> getPresents() {
        return Presents;
    }

    public void setPresents(List<User> presents) {
        Presents = presents;
    }

    public Long getLastSave() {
        return lastSave;
    }

    public void setLastSave(Long lastSave) {
        this.lastSave = lastSave;
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

    public Double getScoreInvite() {
        return scoreInvite;
    }

    public void setScoreInvite(Double scoreInvite) {
        this.scoreInvite = scoreInvite;
    }

    public Integer getScoreLikeSong() {
        return scoreLikeSong;
    }

    public void setScoreLikeSong(Integer scoreLikeSong) {
        this.scoreLikeSong = scoreLikeSong;
    }

    public Double getScorePostSong() {
        return scorePostSong;
    }

    public void setScorePostSong(Double scorePostSong) {
        this.scorePostSong = scorePostSong;
    }

    public Double getScoreStart() {
        return scoreStart;
    }

    public void setScoreStart(Double scoreStart) {
        this.scoreStart = scoreStart;
    }

    public Integer getMinScore() {
        return minScore;
    }

    public void setMinScore(Integer minScore) {
        this.minScore = minScore;
    }

    public Double getScorePlaySong() {
        return scorePlaySong;
    }

    public void setScorePlaySong(Double scorePlaySong) {
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

    public Integer getScoreVotantlikeSong() {
        return scoreVotantlikeSong;
    }

    public void setScoreVotantlikeSong(Integer scoreVotantlikeSong) {
        this.scoreVotantlikeSong = scoreVotantlikeSong;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
    public List<Integer> getSources() {
        return sources;
    }

    public Double getScoreMiseBet() {
        return scoreMiseBet;
    }

    public void setScoreMiseBet(Double scoreMiseBet) {
        this.scoreMiseBet = scoreMiseBet;
    }

    public void setSources(List<Integer> sources) {
        this.sources = sources;
    }

    public String getMusicPlayer() {
        return musicPlayer;
    }

    public void setMusicPlayer(String musicPlayer) {
        this.musicPlayer = musicPlayer;
    }

    public Boolean getPlayerHasFocus() {
        return playerHasFocus;
    }

    public void setPlayerHasFocus(Boolean playerHasFocus) {
        this.playerHasFocus = playerHasFocus;
    }

    public Map<String, Double> getScores() {
        return scores;
    }

    public void setScores(Map<String, Double> scores) {
        this.scores = scores;
    }

    public Map<String, Long> getLastUpdate() {
        return lastUpdate;
    }

    public void setLastUpdate(Map<String, Long> lastUpdate) {
        this.lastUpdate = lastUpdate;
    }


    public void close() {
        this.sendCloseMail();
        this.dtEnd=System.currentTimeMillis();
        this.addOrder("close");
        this.setPresents(new ArrayList<User>());
    }

    public long getDtOrder(String order) {
        for(String s:this.orders){
            if(s.indexOf(order)>0)
                return Long.parseLong(s.split("dtOrder\":")[1].split(",")[0]);
        }
        return 0;
    }

    public String getHTML(DAO dao){
        String code=this.title+"<br><br><img src='"+this.flyer+"'><br><br>";
        for(Song s:dao.getPlayedSongs(this))code+=s.getHTML();
        for(User u:this.getPresents()) code+="<br>"+u.getHTML();
        return code;
    }

    public void addBlacklist(User u) {
        //TODO: gérer les blacklist
    }
}


