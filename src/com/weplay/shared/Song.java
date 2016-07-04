package com.weplay.shared;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Subclass;

import java.io.Serializable;
import java.util.ArrayList;

@Subclass(index=true)
@Cache
public class Song extends Message implements Serializable,Comparable<Song> {
	public static final long serialVersionUID = 1L;
    private static final Integer TORRENT = 0;
    public static final Integer DEEZER = 1;
    public static final Integer SPOTIFY = 2;
    public static final Integer LOCAL= 3;


    @Index
	public Long dtPlay=null;		//Date � laquel la musique est pass�
    private Integer duration=0;
    private String firstname="";

    public ArrayList<String> votants=new ArrayList<String>();
	public Integer score=0;
    private Integer origin=TORRENT;
	
	public Song(){}

    public Song(String title, String htag,Integer duration) {
        super();
        this.title=title;
        this.text=htag;
        this.duration=duration;
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

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public ArrayList<String> getVotants() {
        return votants;
    }

    public void setVotants(ArrayList<String> votants) {
        this.votants = votants;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    @Override
    public int compareTo(Song song) {
        if(song.score>this.score)
            return 1;
        else
        if(this.score==song.score)
            return 0;
        else
            return -1;
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
}
