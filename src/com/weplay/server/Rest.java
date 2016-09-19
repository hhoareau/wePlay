package com.weplay.server;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.repackaged.com.google.common.io.BaseEncoding;
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
    private static final String PASSWORD_MAIL = "hh4271";
    private static final Long DELAY_DECONNEXION = 3L; //en minute


    private static DAO dao = DAO.getInstance();
    public static Logger log = Logger.getLogger(String.valueOf(Rest.class));

    @ApiMethod(name = "geteventsaround", httpMethod = ApiMethod.HttpMethod.GET, path = "geteventsaround")
    public List<Event> geteventsaround(@Named("lat") Double lat,@Named("lng") Double lng) {
        return dao.findEvents(System.currentTimeMillis(),lat,lng);
    }


    @ApiMethod(name = "validatemessage", httpMethod = ApiMethod.HttpMethod.GET, path = "validatemessage")
    public void validatemessage(@Named("message") String id) {
        Message m=dao.findMessage(id);
        Event e=dao.findEvent(m.idEvent);
        e.addOrder("addphoto");
        m.setValidate(true);
        dao.save(m);
        dao.save(e);
    }


    @ApiMethod(name = "getflyer", httpMethod = ApiMethod.HttpMethod.GET, path = "getflyer")
    public Photo getflyer(@Named("event") String id_event) {
        Event e=dao.findEvent(id_event);
        if(e!=null && e.dtEnd>System.currentTimeMillis()){
            Photo p=new Photo(e.getFlyer());
            return p;
        }
        return null;
    }



    @ApiMethod(name = "delmessage", httpMethod = ApiMethod.HttpMethod.GET, path = "delmessage")
    public void delmessage(@Named("message") String id) {
        Message m=dao.findMessage(id);
        User u=dao.findUser(m.from);
        dao.delete(m);
        u.score-=10;
        dao.save(u);
    }


    @ApiMethod(name = "blacklist", httpMethod = ApiMethod.HttpMethod.GET, path = "blacklist")
    public void blacklist(@Named("user") String id) {
        User u=dao.findUser(id);
        Event e=dao.findEvent(u.currentEvent);
        e.addBlacklist(u);
        u.score-=20;
        dao.save(e);
        dao.save(u);
    }


    @ApiMethod(name = "geteventsfrom", httpMethod = ApiMethod.HttpMethod.GET, path = "geteventsfrom")
    public List<Event> geteventsfrom(@Named("user") String user) {
        User u=dao.findUser(user);
        return dao.getFuturEventsFrom(u);
    }


    @ApiMethod(name = "sanity", httpMethod = ApiMethod.HttpMethod.GET, path = "sanity")
    public void sanity(@Named("password") String password) {
        if(!password.equals(PASSWORD_MAIL))return;
        //for(User u:dao.getAllUser())
        for(Event e:dao.getAllEvents()){
            for(String id:e.getLastUpdate().keySet()){
                Long delay=System.currentTimeMillis()-e.getLastUpdate().get(id);
                if(delay>(DELAY_DECONNEXION*1000L*60L)){
                    User u=dao.findUser(id);
                    e.sendQuitMail(u,dao);
                    e.delPresents(u);
                }
            }

            if(e.getPresents().size()==0)
                e.close();
            dao.save(e);
        }
    }


    @ApiMethod(name = "init", httpMethod = ApiMethod.HttpMethod.GET, path = "init")
    public Event init(@Named("scenario") Integer i,@Nullable @Named("event") String idEvent){
        Event e=null;
        if(i==1){
            User u1=new User("hhoareau@gmail.com");
            User u2=new User("paul.dudule@gmail.com");
            e=new Event("Event1",u1);

            e.addPresents(u2);
            e.addPresents(u1);
            e.addOrder("MusicPlayer.html?offline=true&event="+e.getId());

            dao.save(e);
            dao.save(u1);
            dao.save(u2);
        }

        if(i==2) {
            e=dao.getFirstEvent();
            for(LocalFile l:dao.findLocal("smiths",e.getId())){
                Song s=new Song(l);
                s.from=dao.findUser(e.getPresents().get(0));
                e.addSong(s);
                dao.save(s);
            }
            e.addOrder("MusicPlayer.html?offline=true&event="+e.getId());
            dao.save(e);
        }

        return e;
    }

    @ApiMethod(name = "raz", httpMethod = ApiMethod.HttpMethod.GET, path = "raz")
    public void raz() {
        dao.raz();
    }

    @ApiMethod(name = "getevent", httpMethod = ApiMethod.HttpMethod.GET, path = "getevent")
    public Event getevent(@Named("event") String id,@Nullable @Named("user") String user,@Nullable  @Named("lat") Double lat,@Nullable  @Named("lng") Double lng) {
        Event e=dao.findEvent(id);

        if(user!=null){
            Long lastUpdate=e.getLastUpdate().get(user);
            if(lastUpdate==null || System.currentTimeMillis()-lastUpdate>60000){
                e.getLastUpdate().put(user,System.currentTimeMillis());
                dao.save(e);
            }

            User u=dao.findUser(user);
            if(u!=null)
                if(Tools.distance(lat,lng,u.getLat(),u.getLng())>500){ //Si l'utilisateur à beaucoup bouger on met a jour sa position
                    u.setLng(lng);
                    u.setLat(lat);
                    dao.save(u);
                }
        }

        Long delay=System.currentTimeMillis()-e.getDtOrder("playlist");
        if(delay>60*1000*5) e.musicPlayer=null;

        return e;
    }

    @ApiMethod(name = "adduser", httpMethod = ApiMethod.HttpMethod.GET, path = "adduser")
    public User addUser(@Named("infos") String s) {
        infoFacebook infos = null;
        if (s.startsWith("{"))
            infos = new Gson().fromJson(s, infoFacebook.class);
        else
            infos = new infoFacebook(s.replace("\"", ""));

        String id=Tools.encrypt(infos.getId(), "hh4271");
        User u = dao.findUser(BaseEncoding.base64().encode(id.getBytes()).replace("+","_"));
        if (u == null) {
            u = new User(infos);
            u.addHistory("create");
        }

        u.getConnexions().add(System.currentTimeMillis());
        dao.save(u);
        return u;
    }

    @ApiMethod(name = "addevent", httpMethod = ApiMethod.HttpMethod.POST, path = "addevent")
    public Event addEvent(@Named("user") String user,@Named("nsongs") Integer nsongs,Event e) {
        User u = dao.findUser(user);
        if(u==null)return null;

        List<Song> songs=new ArrayList<>();
        for(Song s:dao.getPreferSongs(user,nsongs))
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
    public User addscore(@Named("user") String user,@Named("score") Integer score) {
        User u=dao.findUser(user);
        if(u!=null){
            u.score+=score;
            dao.save(u);
        }
        return u;
    }

    @ApiMethod(name = "getuser", httpMethod = ApiMethod.HttpMethod.GET, path = "getuser")
    public User getuser(@Named("user") String user) {
        User u=dao.findUser(user);
        return u;
    }


    @ApiMethod(name = "join", httpMethod = ApiMethod.HttpMethod.GET, path = "join")
    public User join(@Named("event") String id,
                     @Named("user") String user,
                     @Nullable @Named("from") String from,
                     @Nullable @Named("password") String password) {

        Event e=dao.findEvent(id);
        User u=dao.findUser(user);

        if(u!=null && e!=null) {
            if (e.password != null && e.password.length() > 0 && !e.password.equalsIgnoreCase(password)) {
                return null;
            }

            if(e.dtStart>System.currentTimeMillis()){
                u.message="SELEVENT.NOTSTART";
                return u;
            }

            if (e.Presents.contains(u.id)) {
                u.message = "SELEVENT.ALREADY";
            } else {
                if (e.addPresents(u)) {
                    u.score+=e.scoreStart;
                    u.addHistory("join");
                    u.currentEvent = e.getId();
                    User f = dao.findUser(from);
                    if (f != null) {
                        if(e.addInvited(u))f.score += e.scoreInvite;
                        dao.save(f);
                        e.addOrder("users");
                    }
                    e.addOrder("users");
                    dao.save(e);
                    dao.save(u);
                }
            }
        }

        return u;
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
        //TODO: suppression des chansons locales dans la playlist
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
            User from=dao.findUser(g.from.id);
            if(from==null)return null;

            from.addHistory("song");
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

    @ApiMethod(name = "delevent", httpMethod = ApiMethod.HttpMethod.GET, path = "delevent")
    public List<Event> delevent(@Named("user") String user,@Named("event") String event) {
        User u=dao.findUser(user);
        Event e=dao.findEvent(event);
        if(e!=null && e.dtStart>System.currentTimeMillis() && e.getOwner().id.equals(u.id))
            dao.delete(e);

        return dao.getFuturEventsFrom(u);
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

            User u=dao.findUser(s.from.id);
            if(u!=null){
                u.score+=e.scorePlaySong;
                e.addOrder("users");
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
    public Song setScore(@Named("song") String idsong, @Named("event") String event, @Named("user") String id,@Named("step") Integer step){
        Song s=dao.getSong(idsong);
        Event e=dao.findEvent(event);
        User user=dao.findUser(id);

        if(s!=null && e!=null){
            User prop=dao.findUser(s.from.id);

            if(!prop.id.equals(id)){ //On ne vote pas pour ses propres titres
                if(!s.addVote(id,step))
                    return null;
                else{
                    user.score+=e.getScoreVotantlikeSong()*step; //Voter modifie le score de celui qui vote
                    prop.score+=e.getScoreLikeSong()*step;      //Voter modifie le score de celui qui a proposé le titre
                    dao.save(user);
                    dao.save(prop);
                    dao.save(s);
                    e.addOrder("playlist");                     //demande la mise a jour de la playlist
                    e.addOrder("users");                        //demande la mise a jour du chart
                    dao.save(e);
                    return s;
                }
            }
        }
        return null;
    }


    @ApiMethod(name = "getmessage", httpMethod = ApiMethod.HttpMethod.GET, path = "getmessage")
    public List<Photo> getmessage(@Named("event") String eventid, @Nullable @Named("date") Long date,@Nullable @Named("from") String from) {
        Event e=dao.findEvent(eventid);
        if(e==null || e.dtEnd<System.currentTimeMillis())return null;
        if(date==null)date=e.dtStart;

        List<Photo> rc = new ArrayList<Photo>();

        for (Photo m : dao.getPhotosSince(e, date,true)) {
            if (from==null || m.getAuthor().equals(from))
                if (m.photo != null || m.getText() != null) {
                    rc.add(m);
                }
        }
        //Collection<Message>.sort(rc);
        return (rc);

    }

    @ApiMethod(name = "sendevent", httpMethod = ApiMethod.HttpMethod.POST, path = "sendevent")
    public Event sendevent(Event e) {
        if(dao.findEvent(e.getId())!=null)
            dao.save(e);
        return(e);
    }

    @ApiMethod(name = "updateevent", httpMethod = ApiMethod.HttpMethod.POST, path = "updateevent")
    public Event updateevent(@Named("event") String id,@Named("field") String field,@Nullable @Named("value") String value) {
        Event e=dao.findEvent(id);
        if(e!=null){
            if(field.equals("currentSong")){
                if(value==null)
                    e.currentSong=null;
                else
                    e.currentSong=dao.getSong(value);

                e.addOrder("playlist");
            }

            if(field.equals("musicPlayer"))e.musicPlayer=value;

            if(e.musicPlayer==null){
                e.currentSong=null;
                e.addOrder("playlist");
            }

            dao.save(e);
        }
        return(e);
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
        if(!e.needValidate)p.setValidate(true);
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
    public User quit(@Named("event") String id,@Named("user") String user) {
        Event e=dao.findEvent(id);
        User u=dao.findUser(user);

        if(u!=null && e!=null) {
            if(e.delPresents(u)){
                e.sendQuitMail(u,dao);
                e.addOrder("users");
                dao.save(e);
                dao.save(u);
            }
        }
        return u;
    }

    @ApiMethod(name = "backupphoto", httpMethod = ApiMethod.HttpMethod.GET, path = "backupphoto")
    public List<Photo> backupphoto(@Named("password") String password,@Named("event") String idEvent) {
        Event e=dao.findEvent(idEvent);
        if(e!=null && password.equalsIgnoreCase(PASSWORD_MAIL)){
            List<Photo> rc=new ArrayList<>();
            for(Photo p:dao.getPhotosSince(e,0,true)){
                if(p.getDtBackup()==null){
                    p.setDtBackup(System.currentTimeMillis());
                    dao.save(p);
                    rc.add(p);
                }
            }
            return rc;
        }
        return null;
    }

    @ApiMethod(name = "slideshow", httpMethod = ApiMethod.HttpMethod.GET, path = "slideshow")
    public List<Photo> slideshow(@Nullable @Named("delay") Long delay,@Named("event") String idEvent){
        Event e=dao.findEvent(idEvent);
        if (e == null || e.dtEnd<System.currentTimeMillis())return null;

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
    public Photo lastphoto(@Named("event") String id,@Named("validate") Boolean validate) {
        return dao.getLastPhoto(id,validate);
    }


    @ApiMethod(name = "senduser", httpMethod = ApiMethod.HttpMethod.POST, path = "senduser")
    public User senduser(@Nullable @Named("update") String update, User u) {
        User toUpdate=dao.findUser(u.id);
        if(toUpdate!=null && update!=null){
            if(update.indexOf("anonymous")>-1)toUpdate.anonymous=u.anonymous;
            if(update.indexOf("history")>-1)toUpdate.history=u.history;
            dao.save(toUpdate);
        } else {
            dao.save(u);
        }
        return(u);
    }

    @ApiMethod(name = "searchlocal", httpMethod = ApiMethod.HttpMethod.GET, path = "searchlocal")
    public List<Song> searchlocal(@Named("query") String q,@Named("event") String event) {
        q=q.replace(" ","+");
        List<Song> rc=new ArrayList<>();
        for(LocalFile f:dao.findLocal(q.toLowerCase(),event))rc.add(new Song(f));

        if(rc.size()==0){
            if(q.indexOf(" ")>-1)
                for(LocalFile f:dao.findLocal(q.toLowerCase().split(" ")[0],event))rc.add(new Song(f));
        }

        if(rc.size()==0 && q.indexOf(" ")==-1){
            for(LocalFile f:dao.findLocal(q.toLowerCase().substring(0,q.length()-2),event))rc.add(new Song(f));
        }


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
    public Event sendinvite(@Named("event") String id,@Named("dests") String dests,@Named("from") String from,@Named("shorturl") String shorturl) {
        Event e = dao.findEvent(id);
        if (e != null) {
            e.sendInvite(dests,dao.findUser(from),shorturl);
        }
        return(e);
    }

    @ApiMethod(name = "getclassement", httpMethod = ApiMethod.HttpMethod.GET, path = "getclassement")
    public List<User> getclassement(@Named("event") String id) {
        Event e = dao.findEvent(id);
        if (e == null) return null;

        List<User> lu = new ArrayList<>();
        for(User u:e.Presents){
            u=dao.findUser(u.id);
            u.setScoreEvent(u.score-e.getScores().get(u.id)); //Le score de l'event est le score du user - son score à l'entree dans l'event
            lu.add(u);
        }

        Collections.sort(lu);
        return (lu);
    }


    @ApiMethod(name = "getuserscore", httpMethod = ApiMethod.HttpMethod.GET, path = "getuserscore")
    public List<User> getuserscore(@Named("event") String id) {
        Event e = dao.findEvent(id);
        if (e == null) return null;

        List<User> lu = new ArrayList<>();
        for(String idUser:e.getScores().keySet()){
            User u=dao.findUser(idUser);
            lu.add(u);
        }

        Collections.sort(lu);
        return (lu);
    }

    @ApiMethod(name = "closeevent", httpMethod = ApiMethod.HttpMethod.GET, path = "closeevent")
    public Event closeevent(@Named("event") String event) {
        Event e=dao.findEvent(event);

        //Email de cloture de soirée pour l'ensemble des participants

        for(User u:e.getPresents()){
            u=dao.findUser(u);
            e.sendQuitMail(u,dao);
            u.currentEvent=null;
            dao.save(u);
        }

        e.close();

        dao.save(e);
        return e;
    }

    @ApiMethod(name = "mailtosend", httpMethod = ApiMethod.HttpMethod.GET, path = "mailtosend")
    public List<Mail> mailtosend(@Named("password") String password,@Named("readonly") Boolean readOnly) {
        if(!password.equalsIgnoreCase(PASSWORD_MAIL))return null;
        return dao.getMailToSend(readOnly);
    }

}