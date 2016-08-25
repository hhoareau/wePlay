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

package com.weplay.server;

import com.google.appengine.api.datastore.QueryResultIterator;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.weplay.shared.*;

import java.util.*;
import java.util.logging.Logger;

import static com.googlecode.objectify.ObjectifyService.ofy;


/**
 * Cette classe regroupe l'ensemble des m&#xfffd;thodes utilis&#xfffd;es
 * par les servlet du serveur pour manipuler la base de donn&#xfffd;es de google
 * @see http://code.google.com/p/objectify-appengine/wiki/BestPractices#Utilisez_un_DAO
 *
 * @author Herve Hoareau
 */
public class DAO  {
	private static final Logger log = Logger.getLogger(DAO.class.getName());
    private static DAO dao=null;

	static 	{			
			ObjectifyService.register(User.class);
			ObjectifyService.register(Message.class);	
			ObjectifyService.register(Event.class);
			ObjectifyService.register(Lieu.class);
            ObjectifyService.register(Photo.class);
            ObjectifyService.register(LocalFile.class);
            ObjectifyService.register(Blob.class);
    }



    public static synchronized DAO getInstance() {
        if (null == dao) {
            dao = new DAO();
        }
        return dao;
    }


    public static Long lastDemande=0L;
	
	public List<Message> getPlayList(){
		Long dtStart=System.currentTimeMillis()-10*3600*1000; //10 derniere heures
        return getMessages(dtStart,System.currentTimeMillis());
	}
	
	public Key<User> save(User c) {
		return ofy().save().entity(c).now();
	}
	
	
	public void save(Message m) {
		ofy().save().entity(m);
	}
	

	public void raz() {
        ofy().delete().keys(ofy().load().type(Message.class).keys().list());
        ofy().delete().keys(ofy().load().type(Song.class).keys().list());
        ofy().delete().keys(ofy().load().type(User.class).keys().list());
        ofy().delete().keys(ofy().load().type(Vote.class).keys().list());
        ofy().delete().keys(ofy().load().type(Lieu.class).keys().list());
        ofy().delete().keys(ofy().load().type(Event.class).keys().list());
        ofy().delete().keys(ofy().load().type(LocalFile.class).keys().list());
        ofy().delete().keys(ofy().load().type(Blob.class).keys().list());
	}
	

	public List<Message> findMessages(User user) {
		if(user==null)
			return new ArrayList<Message>();
		else
			return ofy().load().type(Message.class).filter("idUser", user.email).list();
	}


	public User findUser(User u) {
		try{
			return ofy().load().type(User.class).id(u.email).now();
		} catch (Exception e) {
            e.printStackTrace();
            return null;
		}
	}


    public Photo join(Photo p){
        if(!p.photo.startsWith("blob:"))
            return p;
        else{
            List<String> ids= Arrays.asList(p.photo.replace("blob:", "").split(";"));
            Collection<Blob> lb=ofy().load().type(Blob.class).ids(ids).values();
            p.photo="";
            for(Blob b:lb)
                p.photo+=b.data;
            return p;
        }
    }

    public List<Photo> join(List<Photo> lp){
        for(Photo p:lp)
            p=join(p);
        return lp;
    }

	public List<Photo> getPhotosSince(Event e,long dt) {
        return join(ofy().load().type(Photo.class)
                .filter("dtCreate >", dt)
                .filter("idEvent", e.Id)
                .list());
    }

	/**
	 * Retrouve l'evenement d'un message
	 * @param
	 * @return

	public Event findEvents(Message m){
		for(Event e:ofy().load().type(Event.class).filter("dtStart <", m.dtMessage)
								.filter("dtEnd >", m.dtMessage).list()){
			
			Collection<Event> lu=ofy().load().type(Event.class).ids(e.Presents).values();
			User u=ofy().load().type(User.class).id(m.from).now();
			
			if(lu.contains(u))return(e);
		}
		
		return null;
	}
     */
	
	/**
	 * Donne les message depuis x heure
	 * @param delay nombre de d'heure
	 * @return liste des messages
	 */
	public List<Photo> getMessagesFrom(Event e,Long delay) {
		Long dt=System.currentTimeMillis()-3600*delay*1000;
		return getPhotosSince(e,dt);
	}
	


	List<Message> getMessages(long dtStart, long dtEnd) {
		return ofy().load().type(Message.class)
					.filter("dtMesure >", dtStart)
					.filter("dtMesure <", dtEnd).list();
	}
	

	public List<User> getPresents(Event e){
		return (List<User>) ofy().load().type(User.class).ids(e.Invites).values();
	}

	/**
	 * 
	 * @param e
	 * @return la liste de toutes les chansons demand� pour une soir�e
	 */
	public List<Song> getSongs(Event e){
        return ofy().load().type(Song.class).filter("idEvent", e.Id).filter("dtPlay",null).list();
	}


	public User findUser(String from) {
		if(from==null)return null;
		try{
			return ofy().load().type(User.class).id(from).now();
		} catch (Exception e){
            e.printStackTrace();
            return null;
		}
		
	}


	public void save(Event event) {
        event.lastSave=System.currentTimeMillis();
		ofy().save().entities(event);
	}

	
	public Event findEvent(String idEvent) {
		if(idEvent==null)return null;
		try{
			return ofy().load().type(Event.class).id(idEvent).now();
		} catch (Exception e){
            e.printStackTrace();
            return null;
		}
	}

	/**
	 * Recherche d'un evenement par proximit�
	 * @return
	 */
	public Lieu findLieu(double gps_long, double gps_lat) {
		Lieu rc=null;
		Double d=(double) 1000000;
		for(Lieu e:ofy().load().type(Lieu.class).list()){
			if(distance(e.lng,e.lat,gps_long,gps_lat)<d){
				d=distance(e.lng,e.lat,gps_long,gps_lat);
				rc = e;
			}
		}
		return rc;
	}

	private Double distance(Double lg1, Double lat1, double lg2,double lat2) {
		return Math.acos(Math.sin(lg1)*Math.sin(lg2)+Math.cos(lat1)*Math.cos(lat2))*6371;
	}

	/**
	 * 
	 * @param dt
	 * @return event actif at dt date
	 */
	public List<Event> findEvents(Long dt,Double lat,Double lng) {
		List<Event> le=new ArrayList<Event>();
		if(lng==null || lat==null)return le;
        for(Event e:ofy().load().type(Event.class).filter("dtStart <=", dt)	.list()){
            Double d=Tools.distance(lat,lng,e.lat,e.lng,'K')*1000;
            if(e.dtEnd!=null && e.minDistance!=null && e.dtEnd>dt && d<e.minDistance)le.add(e);
        }
		return le;
	}



	/**
	 * Retourne les evenemnts actuellement actifs
	 * @return All actif events
	 */
    List<Event> getActifEvents() {
        return ofy().load().type(Event.class)
                .filter("dtStart <=", System.currentTimeMillis())
                .filter("dtEnd >", System.currentTimeMillis())
                .list();
	}

	public void save(Vote vote) {
		ofy().save().entities(vote);
	}

	public List<User> getUsers(List<String> presents) {
        List<User> rc=new ArrayList<>();
        for(String id:presents)
            rc.add(ofy().load().type(User.class).id(id).now());

        return rc;
	}


	
	/**
	 * 
	 * @param name
	 * @return
	 */
	public List<Lieu> findLieuByName(String name) {
		if(name==null)return null;
		return ofy().load().type(Lieu.class).filter("name",name).list();
	}

	public void save(Lieu l){
		ofy().save().entities(l);
	}


    public void save(LocalFile l){
        ofy().save().entity(l);
    }

	public Lieu findLieu(String number, String street, String cp) {
		for(Lieu l:ofy().load().type(Lieu.class).filter("CP", cp).list())
			if(l.number.equals(number) && l.street.equals(street))return l;
		return null;
	}

	public void delete(User u) {
		ofy().delete().entity(u);
	}

	public Message findMessage(String id) {
		return ofy().load().type(Message.class).id(id).now();
	}

    public Song getSong(String idsong) {
        return ofy().load().type(Song.class).id(idsong).now();
    }

    public List<Song> getSongToPlay(String event,Integer nbr) {
        List<Song> playlist=ofy().load().type(Song.class).filter("idEvent", event).filter("dtPlay",null).list();
        if(playlist.size()==0)return new ArrayList<Song>();
        Collections.sort(playlist);
        if(nbr>playlist.size())nbr=playlist.size();
        return playlist.subList(0, nbr);
    }


    public List<Photo> getPhoto(String event, long dtStart, long dtEnd) {
        List<Photo> rc=new ArrayList<Photo>();
        for(Photo p:ofy().load().type(Photo.class).filter("idEvent", event).filter("dtCreate >",dtStart).list())
            if(p.dtCreate<dtEnd)rc.add(join(p));

        return rc;
    }


    public Photo getLastPhoto(String idevent) {
        List<Photo> rc=ofy().load().type(Photo.class).filter("idEvent", idevent).order("dtCreate").list();
        if(rc.size()>0)
            return join(rc.get(rc.size()-1));
        else
            return null;
    }

    public List<Event> findActifEventsFrom(User u) {
        return ofy().load().type(Event.class).filter("owner",u.email).filter("dtEnd >",System.currentTimeMillis()).list();
    }

    public void saveFiles(List<LocalFile> lf) {
        ofy().save().entities(lf);
    }

    //@return
    public List<LocalFile> findLocal(String q,String event) {
        List<LocalFile> rc=new ArrayList<>();
        for(LocalFile lf:ofy().load().type(LocalFile.class).filter("event",event).list())
            if(lf.getArtist().indexOf(q)>=0 || lf.getTitle().indexOf(q)>=0)
                rc.add(lf);
        return rc;
    }

    public void razlocalfile(String event) {
        List<LocalFile> rc=ofy().load().type(LocalFile.class).filter("event", event).list();
        ofy().delete().entities(rc);
    }

    //@return Song list with email as voter
    public Collection<Song> getPreferSongs(String email,Integer nSongs) {
        Collection<Song> songs=new ArrayList<>();
        QueryResultIterator<Song> q=ofy().load().type(Song.class).iterator();
        while(q.hasNext() && songs.size()<nSongs){
            Song s=q.next();
            if(s.contain(email) || s.from.split(";")[0].equals(email))
                if(!songs.contains(s))
                    songs.add(s);
        }
        return songs;
    }

    public List<Event> getLastEvents(int i) {
        List<Event> rc=ofy().load().type(Event.class).order("dtStart").filter("dtEnd", ">0").list();
        if(rc.size()<i)return(rc);

        return rc.subList(0, i);
    }

    public Collection<Song> getBestSongs(Event e, int i) {
        List<Song> rc=ofy().load().type(Song.class).order("score").list();
        if(rc.size()<i)i=rc.size()-1;
        return rc.subList(0,i);
    }

    public void save(List<Message> mes) {
        ofy().save().entities(mes);
    }

    public void saveList(List<Blob> lb) {
        ofy().save().entities(lb);
    }
}