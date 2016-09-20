package com.weplay.shared;

import com.google.appengine.repackaged.com.google.common.io.BaseEncoding;
import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Subclass;

import java.io.Serializable;
import java.util.Collection;

@Subclass(index=true)
@Cache
public class Song extends Message implements Serializable,Comparable<Song> {
	public static final long serialVersionUID = 1L;
    private static final Integer TORRENT = 0;
    public static final Integer DEEZER = 1;
    public static final Integer SPOTIFY = 2;
    public static final Integer LOCAL= 3;
    private static final int MAXLEN_SHORT_TITLE = 40;

    @Index
	public Long dtPlay=null;		//Date � laquel la musique est pass�
    private Integer duration=0;
    private String firstname="";
    public String shortTitle="";

	public Integer score=0;
    private Integer origin=TORRENT;
	
	public Song(){}

    public Song(String title, String htag,Integer duration) {
        super();
        this.title=title;
        this.shortTitle=this.title.substring(0,Math.min(MAXLEN_SHORT_TITLE,this.title.length()));
        this.Id=this.Id+ BaseEncoding.base64().encode(title.getBytes()).replace("+","_");
        this.text=htag;
        this.duration=duration;
    }

    public Song(LocalFile f) {
        super();
        this.title=f.getTitle();
        this.shortTitle=this.title.substring(0, Math.min(MAXLEN_SHORT_TITLE, this.title.length()));
        this.text=f.getText();
        this.setId(this.getId()+BaseEncoding.base64().encode(this.text.getBytes()));
        this.setAuthor(f.getArtist());
        this.origin=LOCAL;
    }


    public boolean isIn(Collection<Song> songs){
        for(Song s:songs)
            if(s.text.equals(this.text) || s.Id.equals(this.getId()))
                return true;
        return false;
    }

    public Song(Message m){
        this.title=m.title;
        this.shortTitle=this.title.substring(0,Math.min(MAXLEN_SHORT_TITLE,this.title.length()));
        this.type=m.type;
        this.from=m.from;
        this.text=m.text;
        this.setId();
    }

    public Song(String title,Integer duration) {
        this.title=title;
        this.shortTitle=this.title.substring(0,Math.min(MAXLEN_SHORT_TITLE,this.title.length()));
        this.Id=this.Id+BaseEncoding.base64().encode(title.getBytes()).replace("+","_");
        this.duration=duration;
    }
    
    public Song(Song p){
        super(p);
        this.dtPlay=p.dtPlay;
        this.votes=p.votes;
        this.shortTitle=p.shortTitle;
        this.firstname=p.firstname;
        this.duration=p.duration;
        this.origin=p.origin;
        this.from=p.from;
    }

    public Long getDtPlay() {
        return dtPlay;
    }

    public void setDtPlay(Long dtPlay) {
        this.dtPlay = dtPlay;
    }

    public Long getDtCreate() {
        return dtCreate;
    }

    public void setDtCreate(Long dtCreate) {
        this.dtCreate = dtCreate;
    }

    public String getTitle() {
        return title;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public int compareTo(Song song) {
        if(song.score>this.score)return 1;
        if(song.score<this.score)return -1;
        return 0;
    }

    public Integer getDuration() {
        return duration;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }


    public Integer getOrigin() {
        return origin;
    }

    public void setOrigin(Integer origin) {
        this.origin = origin;
    }


    public String getShortTitle() {
        return shortTitle;
    }

    public void setShortTitle(String shortTitle) {
        this.shortTitle = shortTitle;
    }

    public void razuse() {
        this.dtPlay=null;
        this.idEvent=null;
    }

    public void setShortTitle() {
        this.shortTitle=this.title.substring(0,Math.min(MAXLEN_SHORT_TITLE,this.title.length()));
    }

    public String getHTML(){
        String code=this.title+" by "+this.getAuthor()+"<br>";
        return code;
    }
}
