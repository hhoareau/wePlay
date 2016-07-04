package com.weplay.server;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
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

        User u = dao.findUser(infos.email);
        if (u == null) {
            u = new User(infos);
            dao.save(u);
        }
        return u;
    }




        @ApiMethod(name = "addevent", httpMethod = ApiMethod.HttpMethod.POST, path = "addevent")
    public void addEvent(@Named("email") String email,Event e) {

        User u = dao.findUser(email);
        if(u==null)return;
        dao.save(e);

        //Lieu nl = new Lieu(position);
        //List<Lieu> l=dao.findLieuByName(nl.name);

        /*
        if(u!=null){
            if(l.size()>0)
                nl=l.get(0);
            else {
                if(nl.CP!=null && nl.CP.length()>0 && nl.street.length()>0){
                    if(ici.equals("true")){
                        nl.setPosition(position);
                        dao.save(nl);
                    }else{
                        dao.save(nl);
                        new RestCall("https://maps.google.com/maps/api/geocode/json?address="+nl.getAddress()+"&sensor=false",null,nl.Id){
                            @Override public void onSuccess(String rep){
                                if(rep.contains("lat") && rep.contains("lng")){
                                    String lat=Tools.extract(rep, "\"lat\" : ",",",false);
                                    String lg=Tools.extract(rep, "\"lng\" : ","}",false).trim();
                                    Lieu l=dao.findLieu(this.id);
                                    l.setPosition(lat+","+lg);
                                    dao.save(l);
                                }
                            }
                        };
                    }
                }
            }
            */
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
        return dao.findUser(email);
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
                if(from!=null){
                    User f=dao.findUser(from);
                    f.score+=e.scoreInvite;
                    dao.save(f);
                }

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
        return dao.getSongToPlay(event,nombre);
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
            dao.save(lf);
        }
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




    @ApiMethod(name = "getsongtoplay", httpMethod = ApiMethod.HttpMethod.GET, path = "getsongtoplay")
    public Song getsongtoplay(@Named("event") String event) {
        Event e=dao.findEvent(event);
        if(e==null)return null;
        List<Song> ls=dao.getSongToPlay(event,1);
        if(ls.size()==0)return null;
        Song s=ls.get(0);

        User u=dao.findUser(s.from.split(";")[0]);
        if(u!=null){
            u.score+=e.scorePlaySong;
            dao.save(u);
        }

        if(s==null)return null;
        s.dtPlay=System.currentTimeMillis();
        dao.save(s);
        return s;
    }


    @ApiMethod(name = "setscore", httpMethod = ApiMethod.HttpMethod.GET, path = "setscore")
    public Song setScore(@Named("song") String idsong, @Named("event") String event, @Named("user") String email,@Named("step") Integer step){
        Song s=dao.getSong(idsong);
        Event e=dao.findEvent(event);

        if(s!=null && e!=null){
            User prop=dao.findUser(s.from.split(";")[0]);
            if(!prop.email.equals(email)){
                prop.score+=e.getScoreLikeSong()*step;
                dao.save(prop);

                if(s.votants.contains(email)){
                    return null;
                } else{
                    s.score+=step;
                    s.votants.add(email);

                    dao.save(s);
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
        dao.save(p);
        e.lastSave=System.currentTimeMillis();
        dao.save(e);

        /*
        if(m.type==Message.TYPE_VIDEO){
            new RestCall("http://gdata.youtube.com/feeds/api/videos/"+new Song(m).getYouTubeID()+"?v=2",null,m.Id){
                @Override public void onSuccess(String rep){
                    Message m=dao.findMessage(this.id);
                    Song sg=new Song(m);
                    sg.setTitle(Tools.extract(rep, "<title>", "</title>", false));
                    e.addSong(sg);
                }

                @Override public void onFailure(int rc){
                    Message m=dao.findMessage(this.id);
                    Song sg=new Song(m);
                    sg.setTitle(m.title);
                    e.addSong(sg);
                }
            };
        }*/

        /*
        if(m.type==Message.TYPE_DEMANDE){
            Demande d=new Demande(m);
            d.icon=Tools.extract(e.getDemande(d.nature), "demandIcon=", "\r", false);
            d.photo=Tools.extract(e.getDemande(d.nature), "demandPhoto=", "\r", false);
            User dest=dao.findUser(d.to);
            if(dest!=null)
                if(dest.addDemande(d)){
                    dao.save(dest);
                    Message dd=new Message(d,u,dest);
                    if(dd.photo==null || dd.photo.length()<10){
                        String str=this.loadFile(d.photo);
                        if(str!=null)dd.photo= Base64.encode(str.getBytes());
                    }
                    dao.save(dd);
                }
        }
        dao.save(e);
        */

        return(e);
    }


    @ApiMethod(name = "addsong", httpMethod = ApiMethod.HttpMethod.POST, path = "addsong")
    public Event addsong(@Named("event") String id,Song g) {
        Event e=dao.findEvent(id);
        User from=dao.findUser(g.from.split(";")[0]);

        if(from.score<e.minScore)return(e);

        from.score+=e.scorePostSong;

        e.lastSave=System.currentTimeMillis();

        dao.save(e);
        dao.save(from);
        dao.save(g);

        return(e);
    }


    @ApiMethod(name = "getplaylist", httpMethod = ApiMethod.HttpMethod.GET, path = "getplaylist")
    public List<Song> getplaylist(@Named("event") String id) {
        Event e=dao.findEvent(id);
        List<Song> rc=dao.getSongs(e);
        Collections.sort(rc);
        return rc;
    }


    @ApiMethod(name = "quit", httpMethod = ApiMethod.HttpMethod.GET, path = "quit")
    public void quit(@Named("event") String id,@Named("email") String email) {
        Event e=dao.findEvent(id);
        User u=dao.findUser(email);

        if(u!=null && e!=null) {
            if(e.delPresents(u)){
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
    public List<LocalFile> searchlocal(@Named("query") String q,@Named("event") String event) {
        q=q.replace(" ","+");
        return dao.findLocal(q.toLowerCase(),event);
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


    /*
    @ApiMethod(name = "deluser", httpMethod = ApiMethod.HttpMethod.GET, path = "deluser")
    public void delUser(@Named("user") String email) {
        User u=dao.findUser(email);
        if(u!=null)
            dao.delete(u);
    }




    @ApiMethod(name = "setdtplay", httpMethod = ApiMethod.HttpMethod.GET, path = "setdtplay")
    public Event setDtPlay(@Named("event") String event, @Named("user") String email, @Named("song") String id){
        User u=dao.findUser(email);
        Event e=dao.findEvent(event);

        Song s=e.getSong(id);
        if(s!=null){
            s.dtPlay=Tools.StringToDate("now");
            e.addSong(s);
            dao.save(e);
            return e;
        }
        return null;
    }



















    @ApiMethod(name = "findplace", httpMethod = ApiMethod.HttpMethod.GET, path = "findplace")
    public List<Lieu> findplace(@Named("name") String name) {
        return dao.findLieuByName(name);
    }




    */

}