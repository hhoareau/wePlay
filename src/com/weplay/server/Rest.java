package com.weplay.server;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
import com.google.appengine.labs.repackaged.com.google.common.io.BaseEncoding;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.repackaged.com.google.gson.Gson;
import com.weplay.shared.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;

//http://localhost:8888/_ah/api/irl/v1/init
@Api(   name = "ficarbar",
        description= "irl rest service",
        clientIds = {"AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0"},
        version = "v1")
public class Rest {
    public static final Long TYPE_MESSAGE = 0L;
    public static final Long TYPE_VIDEO = 2L;
    public static final Long TYPE_SONG = 3L;
    public static final Long TYPE_DEMANDE = 4L;
    private static final int MAX_QUOTA = 1000000;

    private static DAO dao = DAO.getInstance();
    public static Logger log = Logger.getLogger(String.valueOf(Rest.class));

    @ApiMethod(name = "geteventsaround", httpMethod = ApiMethod.HttpMethod.GET, path = "geteventsaround")
    public List<Event> geteventsaround(@Named("lat") Double lat,@Named("lng") Double lng) {
        return dao.findEvents(System.currentTimeMillis(),lat,lng);
    }

    @ApiMethod(name = "geteventsfrom", httpMethod = ApiMethod.HttpMethod.GET, path = "geteventsfrom")
    public List<Event> geteventsfrom(@Named("email") String email) {
        User u=dao.findUser(email);
        return dao.findActifEventsFrom(u);
    }

    @ApiMethod(name = "init", httpMethod = ApiMethod.HttpMethod.GET, path = "init")
    public Event init(@Named("scenario") Integer i){
        Event e=null;
        if(i==1){
            User u1=new User("hhoareau@gmail.com");
            User u2=new User("paul.dudule@gmail.com");
            e=new Event("Event1",u1);
            e.addSong(new Song("Get Lucky",30));
            e.addSong(new Song("Da Funk",60));
            e.addSong(new Song("Boy's don't cry",25));
            e.addSong(new Song("Clock",180));
            e.addInvited(u2);
        }
        return e;
    }

    @ApiMethod(name = "raz", httpMethod = ApiMethod.HttpMethod.GET, path = "raz")
    public void raz() {
        dao.raz();
    }

    @ApiMethod(name = "getevent", httpMethod = ApiMethod.HttpMethod.GET, path = "getevent")
    public Event getevent(@Named("event") String id) {
        return dao.findEvent(id);
    }



    @ApiMethod(name = "adduser", httpMethod = ApiMethod.HttpMethod.GET, path = "adduser")
    public User addUser(@Named("infos") String s) {
        infoFacebook infos = null;
        if (s.startsWith("{"))
            infos = new Gson().fromJson(s, infoFacebook.class);
        else
            infos = new infoFacebook(s.replace("\"", ""));

        String id=Tools.encrypt(infos.email, "hh4271");
        User u = dao.findUser(BaseEncoding.base64().encode(id.getBytes()).replace("+","_"));
        if (u == null) {
            u = new User(infos);
            dao.save(u);
        }
        return u;
    }

    @ApiMethod(name = "addevent", httpMethod = ApiMethod.HttpMethod.POST, path = "addevent")
    public Event addEvent(@Named("email") String email,@Named("nsongs") Integer nsongs,Event e) {
        User u = dao.findUser(email);
        if(u==null)return null;

        List<Song> songs=new ArrayList<>();
        for(Song s:dao.getPreferSongs(email,nsongs))
            if(!s.isIn(songs))songs.add(s);

        if(songs.size()<nsongs){
            for(Event old_e:dao.getLastEvents(10))
                for(Song s:dao.getBestSongs(old_e, 5))
                    if(!s.isIn(songs))songs.add(s);
        }

        if(songs.size()>nsongs)songs=songs.subList(0,nsongs-1);

        for(Song s:songs){
            Song ns=new Song(s);
            ns.score=-5;
            ns.razuse();
            if(ns.getOrigin()!=Song.LOCAL && e.addSong(ns))dao.save(ns);
        }

        e.addOrder("playlist");
        dao.save(e);
        return(e);
    }

    @ApiMethod(name = "addscore", httpMethod = ApiMethod.HttpMethod.GET, path = "addscore")
    public User addscore(@Named("email") String email,@Named("score") Integer score) {
        User u=dao.findUser(email);
        if(u!=null){
            u.score+=score;
            dao.save(u);
        }
        return u;
    }

    @ApiMethod(name = "getuser", httpMethod = ApiMethod.HttpMethod.GET, path = "getuser")
    public User getuser(@Named("email") String email) {
        User u=dao.findUser(email);
        return u;
    }

    @ApiMethod(name = "join", httpMethod = ApiMethod.HttpMethod.GET, path = "join")
    public User join(@Named("event") String id,@Named("email") String email,@Nullable @Named("from") String from,@Nullable @Named("password") String password) {
        Event e=dao.findEvent(id);
        User u=dao.findUser(email);

        if(u!=null && e!=null) {
            if (e.password != null && e.password.length()>0 && !e.password.equalsIgnoreCase(password)) {
                return null;
            }
            if (e.addPresents(u)) {
                u.score=e.scoreStart;
                User f=dao.findUser(from);
                if(f!=null){
                    f.score+=e.scoreInvite;
                    dao.save(f);
                    e.addOrder("updateuser");
                }
                e.addOrder("join");
                dao.save(e);
                dao.save(u);
            }
            return u;
        }
        return null;
    }


    @ApiMethod(name = "gettopsongs", httpMethod = ApiMethod.HttpMethod.GET, path = "gettopsongs")
    public List<Song> gettopsongs(@Named("event") String event,@Named("nombre") Integer nombre) {
        Event e=dao.findEvent(event);
        if(e==null)return null;
        e.addOrder("playlist");
        dao.save(e);
        return dao.getSongToPlay(e.getId(),nombre);
    }


    @ApiMethod(name = "razlocalfile", httpMethod = ApiMethod.HttpMethod.GET, path = "razlocalfile")
    public void razlocalfile(@Named("event") String event) {
        Event e=dao.findEvent(event);
        if(e==null)return;
        dao.razlocalfile(event);
    }

    @ApiMethod(name = "uploadfiles", httpMethod = ApiMethod.HttpMethod.POST, path = "uploadfiles")
    public void uploadfiles(localFiles j) {
        List<LocalFile> lf=j.getFiles();
        if(lf.size()==0)return;

        Event e=dao.findEvent(lf.get(0).getEvent());
        if(e!=null){
            //for(LocalFile f:lf){f.setText(f.getText().toLowerCase());}
            //for(LocalFile f:lf)dao.save(f);
            dao.saveFiles(lf);
        }
    }


    @ApiMethod(name = "addsong", httpMethod = ApiMethod.HttpMethod.POST, path = "addsong")
    public Song addsong(@Named("event") String id,Song g) {
        Event e=dao.findEvent(id);
        if(e==null)return null;

        g.setShortTitle();
        if(e.addSong(g)){
            User from=dao.findUser(g.from.split(";")[0]);
            if(from==null)return null;

            if(from.score<e.minScore)return(null);

            from.score+=e.scorePostSong;



            dao.save(e);
            dao.save(from);
            dao.save(g);
            return(g);
        }
        else return null;
    }


    @ApiMethod(name = "getmagnets", httpMethod = ApiMethod.HttpMethod.GET, path = "getmagnets")
    public List<String> getmagnets(@Named("torrents") String torrents) {
        for(String torrent:torrents.split(";")){
            RestCall r=new RestCall<String>("https://torrentproject.se/"+torrent,null,null) {
                @Override
                public void onSuccess(String rep) {
                    int start=rep.indexOf("magnet:");
                    int end=rep.indexOf("'",start);
                    String magnet=rep.substring(start, end);
                    rc.add(magnet);
                }

                @Override
                public List<String> getSongs() {
                    return rc;
                }
            };
            return r.getSongs();
        }
        return null;
    }



    @ApiMethod(name = "getcurrentsong", httpMethod = ApiMethod.HttpMethod.GET, path = "getcurrentsong")
    public Song getcurrentsong(@Named("event") String event) {
        Event e=dao.findEvent(event);
        if(e==null)return null;
        return e.currentSong;
    }

    @ApiMethod(name = "stopcurrentsong", httpMethod = ApiMethod.HttpMethod.GET, path = "stopcurrentsong")
    public void stopcurrentsong(@Named("event") String event) {
        Event e=dao.findEvent(event);
        if(e!=null){
            e.currentSong=null;
            dao.save(e);
        }
    }

    @ApiMethod(name = "setorder", httpMethod = ApiMethod.HttpMethod.GET, path = "setorder")
    public void setorder(@Named("event") String event,@Named("order") String order) {
        Event e=dao.findEvent(event);
        if(e!=null){
            e.setOrder(order);
            dao.save(e);
        }
    }



    @ApiMethod(name = "getsongtoplay", httpMethod = ApiMethod.HttpMethod.GET, path = "getsongtoplay")
    public Song getsongtoplay(@Named("event") String event) {
        Event e=dao.findEvent(event);
        if(e==null)return null;
        List<Song> ls=dao.getSongToPlay(event,1);
        Song s=null;
        if(ls.size()>0){
            s=ls.get(0);

            User u=dao.findUser(s.from.split(";")[0]);
            if(u!=null){
                u.score+=e.scorePlaySong;
                dao.save(u);
            }

            s.dtPlay=System.currentTimeMillis();
            dao.save(s);
        }

        e.currentSong=s;
        e.addOrder("playlist");
        dao.save(e);

        return s;
    }


    @ApiMethod(name = "setscore", httpMethod = ApiMethod.HttpMethod.GET, path = "setscore")
    public Song setScore(@Named("song") String idsong, @Named("event") String event, @Named("user") String email,@Named("step") Integer step){
        Song s=dao.getSong(idsong);
        Event e=dao.findEvent(event);

        if(s!=null && e!=null){
            User prop=dao.findUser(s.from.split(";")[0]);
            if(!prop.email.equals(email)){ //On ne vote pas pour ses propres titres
                if(!s.addVote(email,step))
                    return null;
                else{
                    prop.score+=e.getScoreLikeSong()*step;
                    dao.save(prop);
                    dao.save(s);
                    e.addOrder("playlist");
                    dao.save(e);
                    return s;
                }
            }
        }
        return null;
    }


    @ApiMethod(name = "getmessage", httpMethod = ApiMethod.HttpMethod.GET, path = "getmessage")
    public List<Photo> getmessage(@Named("event") String eventid, @Named("date") Long date) {
        Event e=dao.findEvent(eventid);
        if(e==null)return null;
        if(e.lastSave>=date) {    //Si un message a ete ajout� depuis le dernier message r�cup�r� par la session
            List<Photo> rc = new ArrayList<Photo>();

            for (Photo m : dao.getPhotosSince(e, date)) {
                if (m.photo != null || m.getText() != null) {
                    m.user=dao.findUser(m.from);
                    rc.add(m);
                }
            }
            //Collection<Message>.sort(rc);
            return (rc);
        }
        return null;
    }


    @ApiMethod(name = "sendphoto", httpMethod = ApiMethod.HttpMethod.POST, path = "sendphoto")
    public Event sendphoto(@Named("event") String id,Photo p) {
        Event e=dao.findEvent(id);
        if(e==null)return null;

        int size_photo=p.photo.length();

        if(size_photo>MAX_QUOTA){
            List<Blob> lb=p.split(size_photo/MAX_QUOTA+1);
            dao.saveList(lb);
        }
        dao.save(p);

        e.addOrder("addphoto");
        dao.save(e);
        return(e);
    }

    @ApiMethod(name = "getplaylist", httpMethod = ApiMethod.HttpMethod.GET, path = "getplaylist")
    public List<Song> getplaylist(@Named("event") String id) {
        Event e=dao.findEvent(id);
        if(e==null)return null;
        List<Song> rc=dao.getSongs(e);
        Collections.sort(rc);

        rc.add(e.currentSong);

        return rc;
    }

    @ApiMethod(name = "quit", httpMethod = ApiMethod.HttpMethod.GET, path = "quit")
    public void quit(@Named("event") String id,@Named("email") String email) {
        Event e=dao.findEvent(id);
        User u=dao.findUser(email);

        if(u!=null && e!=null) {
            if(e.delPresents(u)){
                u.currentEvent=null;
                dao.save(e);
                dao.save(u);
            }
        }
    }


    @ApiMethod(name = "slideshow", httpMethod = ApiMethod.HttpMethod.GET, path = "slideshow")
    public List<Photo> slideshow(@Nullable @Named("delay") Long delay,@Named("event") String idEvent){
        List<Photo> lPhoto=new ArrayList<>();

        if(delay!=null){
            lPhoto=dao.getPhoto(idEvent, System.currentTimeMillis() - delay * 1000 * 60, System.currentTimeMillis());
        } else {
            lPhoto=dao.getPhoto(idEvent,0L, System.currentTimeMillis());
        }

        Collections.sort(lPhoto); //Les derniers messages en premier dans la liste

        return lPhoto;
    }

    @ApiMethod(name = "lastphoto", httpMethod = ApiMethod.HttpMethod.GET, path = "lastphoto")
    public Photo lastphoto(@Named("event") String id) {
        return dao.getLastPhoto(id);
    }

    @ApiMethod(name = "senduser", httpMethod = ApiMethod.HttpMethod.POST, path = "senduser")
    public User senduser(@Named("update") String update, User u) {
        User toUpdate=dao.findUser(u.email);
        if(toUpdate!=null && update!=null){
            if(update.indexOf("anonymous")>-1)toUpdate.anonymous=u.anonymous;
            dao.save(toUpdate);
        }
        return(toUpdate);
    }

    @ApiMethod(name = "searchlocal", httpMethod = ApiMethod.HttpMethod.GET, path = "searchlocal")
    public List<Song> searchlocal(@Named("query") String q,@Named("event") String event) {
        q=q.replace(" ","+");
        List<Song> rc=new ArrayList<>();
        for(LocalFile f:dao.findLocal(q.toLowerCase(),event))
            rc.add(new Song(f));
        return rc;
    }

    @ApiMethod(name = "searchtorrent", httpMethod = ApiMethod.HttpMethod.GET, path = "searchtorrent")
    public List<Song> searchtorrent(@Named("query") String q) {
        RestCall r= new RestCall<Song>("https://torrentproject.se?filter=1102&orderby=best&num=40&safe=on&s=" + q + "&out=json", null, null) {
            @Override
            public void onSuccess(String rep) {
                this.rc=new ArrayList<>();
                try {
                    JSONObject j=new JSONObject(rep);
                    for(int i=1;i<=20;i++){
                        JSONObject obj=j.getJSONObject(String.valueOf(i));
                        String sTitle=obj.getString("title");
                        String sTorrent=j.getJSONObject(String.valueOf(i)).getString("torrent_hash");
                        //String magnet="magnet:?xt=urn:btih:"+sTorrent+"&dn=Daft Punk Discovery&tr=http://109.121.134.121:1337/announce&tr=http://thetracker.org:80/announce&tr=http://tracker.kicks-ass.net:80/announce&tr=udp://109.121.134.121:1337/announce&tr=udp://178.33.73.26:2710/announce&tr=udp://explodie.org:6969/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://thetracker.org./announce&tr=udp://thetracker.org.:80/announce&tr=udp://tracker.bittorrent.am:80/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://tracker.kicks-ass.net:80/announce&tr=udp://tracker.mg64.net:2710/announce&tr=udp://tracker.sktorrent.net:6969/announce&tr=udp://zer0day.ch:1337/announce";
                        this.rc.add(new Song(sTitle,sTorrent,0));
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public List<Song> getSongs(){
                return rc;
            }
        };
        return r.getSongs();
    }

    @ApiMethod(name = "sendinvite", httpMethod = ApiMethod.HttpMethod.GET, path = "sendinvite")
    public void sendinvite(@Named("event") String id,@Named("dests") String dests,@Named("from") String from) {
        Event e = dao.findEvent(id);
        if (e != null) {
            e.sendInvite(dests, from);
        }
    }

    @ApiMethod(name = "getclassement", httpMethod = ApiMethod.HttpMethod.GET, path = "getclassement")
      public List<User> getclassement(@Named("event") String id) {
        Event e = dao.findEvent(id);
        if (e == null) return null;

        List<User> lu = dao.getUsers(e.Presents);
        Collections.sort(lu);
        return (lu);
    }

    @ApiMethod(name = "closeevent", httpMethod = ApiMethod.HttpMethod.GET, path = "closeevent")
    public void closeevent(@Named("event") String event,@Named("email") String email) {
        Event e=dao.findEvent(event);
        e.dtEnd=System.currentTimeMillis();
        dao.save(e);
    }
}