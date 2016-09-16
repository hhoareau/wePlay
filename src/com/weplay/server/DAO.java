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

            ObjectifyService.register(Photo.class);
            ObjectifyService.register(LocalFile.class);
            ObjectifyService.register(Blob.class);
            ObjectifyService.register(Sondage.class);
            ObjectifyService.register(Mail.class);
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
        ofy().save().entity(m).now();
	}
	

	public void raz() {
        ofy().delete().keys(ofy().load().type(Message.class).keys().list());
        ofy().delete().keys(ofy().load().type(Song.class).keys().list());
        ofy().delete().keys(ofy().load().type(User.class).keys().list());
        ofy().delete().keys(ofy().load().type(Vote.class).keys().list());
        ofy().delete().keys(ofy().load().type(Event.class).keys().list());
        ofy().delete().keys(ofy().load().type(LocalFile.class).keys().list());
        ofy().delete().keys(ofy().load().type(Blob.class).keys().list());
        ofy().delete().keys(ofy().load().type(Sondage.class).keys().list());
        ofy().delete().keys(ofy().load().type(Mail.class).keys().list());
    }
	

	public List<Message> findMessages(User user) {
		if(user==null)
			return new ArrayList<Message>();
		else
			return ofy().load().type(Message.class).filter("idUser", user.id).list();
	}


	public User findUser(User u) {
		try{
			return ofy().load().type(User.class).id(u.id).now();
		} catch (Exception e) {
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

	public List<Photo> getPhotosSince(Event e,long dt,Boolean validate) {
        return join(ofy().load().type(Photo.class)
                .filter("dtCreate >", dt)
                .filter("validate", validate)
                .filter("idEvent", e.Id)
                .list());
    }

	/**
	 * Donne les message depuis x heure
	 * @param delay nombre de d'heure
	 * @return liste des messages
	 */
	public List<Photo> getMessagesFrom(Event e,Long delay) {
		Long dt=System.currentTimeMillis()-3600*delay*1000;
		return getPhotosSince(e,dt,true);
	}
	


	List<Message> getMessages(long dtStart, long dtEnd) {
		return ofy().load().type(Message.class)
					.filter("dtMesure >", dtStart)
					.filter("dtMesure <", dtEnd).list();
	}
	

	public Collection<User> getPresents(Event e){
        List<User> presents=e.getPresents();
        Collection<User> rc=ofy().load().type(User.class).ids(presents).values();
		return rc;
	}

	/**
	 * 
	 * @param e
	 * @return la liste de toutes les chansons demand� pour une soir�e
	 */
	public List<Song> getSongs(Event e){
        return ofy().load().type(Song.class).filter("idEvent", e.Id).filter("dtPlay",null).list();
	}

    public List<Song> getPlayedSongs(Event e){
        return ofy().load().type(Song.class).filter("idEvent", e.Id).filter("dtPlay >",0).list();
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
		ofy().save().entities(event).now();
	}

    public Event getFirstEvent() {
        List<Event> l=getActifEvents();
        return l.get(0);
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
        for(Event e:ofy().load().type(Event.class).filter("dtEnd >", dt).list()){
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
        List<Event> rc=new ArrayList<>();

        for(Event e:ofy().load().type(Event.class).filter("dtStart <=", System.currentTimeMillis()).list())
            if(e.dtEnd>System.currentTimeMillis())
                rc.add(e);

        return rc;
	}

	public void save(Vote vote) {
		ofy().save().entities(vote).now();
	}

	public List<User> getUsers(List<String> presents) {
        List<User> rc=new ArrayList<>();
        for(String id:presents)
            rc.add(ofy().load().type(User.class).id(id).now());

        return rc;
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
        for(Photo p:ofy().load().type(Photo.class)
                .filter("idEvent", event)
                .filter("validate",true)
                .filter("dtCreate >", dtStart).list())
            if(p.dtCreate<dtEnd)rc.add(join(p));

        return rc;
    }


    public Photo getLastPhoto(String idevent,Boolean validate) {
        List<Photo> rc=ofy()
                .load().type(Photo.class)
                .filter("idEvent", idevent)
                .filter("validate", validate)
                .order("dtCreate")
                .list();

        if(rc.size()>0)
            return join(rc.get(rc.size()-1));
        else
            return null;
    }

    public List<Event> findActifEventsFrom(User u) {
        List<Event> rc=new ArrayList<>();
        for(Event e:ofy().load().type(Event.class).filter("dtEnd >",System.currentTimeMillis()).list())
            if(e.getOwner().id.equals(u.id))
                rc.add(e);
        return rc;
    }


    public List<Event> getFuturEventsFrom(User u) {
        List<Event> rc=new ArrayList<>();
        for(Event e:ofy().load().type(Event.class).filter("dtEnd > ",System.currentTimeMillis()).list())
            if(e.getOwner().id.equals(u.id))
                rc.add(e);

        return rc;
    }

    public void saveFiles(List<LocalFile> lf) {
        ofy().save().entities(lf);
    }

    //@return
    public List<LocalFile> findLocal(String q,String event) {
        List<LocalFile> rc=new ArrayList<>();
        for(LocalFile lf:ofy().load().type(LocalFile.class).filter("event",event).list())
            if(lf.getArtist().indexOf(q.toLowerCase())>=0 || lf.getTitle().indexOf(q.toLowerCase())>=0)
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
            if(s.contain(email) || s.from.id.equals(email))
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

    public Collection<Event> getAllEvents() {
        return ofy().load().type(Event.class).list();
    }


    public List<Mail> getMailToSend(Boolean readOnly) {
        List<Mail> rc=ofy().load().type(Mail.class).filter("dtSend",null).list();
        if(!readOnly)
            for(Mail m:rc){
                m.dtSend=System.currentTimeMillis();
                ofy().save().entity(m);
            }
        return rc;
    }



    public static void sendMail(String dest,String country,String from,String subject,String body,List<String> params){
        /*
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        try {
            javax.mail.Message msg = new MimeMessage(session);
            msg.setFrom(new InternetAddress(from));
            msg.addRecipient(MimeMessage.RecipientType.TO, new InternetAddress(dest));
            msg.setSubject(subject);
            msg.setText(body);
            Transport.send(msg);
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        */
        if(body.startsWith("#")){
            String file=body.substring(1);
            file=file.replace(".htm","_"+country+".htm");

            body="{\"file\":\""+file+"\"";
            if(params!=null && params.size()>0)
                for(int i=0;i<params.size();i++){
                    body+=",\"param"+i+"\":\""+params.get(i).replaceAll("\"","'")+"\"";
                }
            body+="}";
        }


        Mail m=new Mail(body,subject,from,dest);
        ofy().save().entity(m);

    }

    public void delete(Event e) {
        ofy().delete().entity(e).now();
    }

    public void delete(Message m) {
        ofy().delete().entity(m);
    }
}