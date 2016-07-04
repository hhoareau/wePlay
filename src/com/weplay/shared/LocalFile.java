package com.weplay.shared;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;

/**
 * Created by u016272 on 28/06/2016.
 */
@Entity
public class LocalFile implements Serializable  {
    @Id
    private
    String text="";
    private Integer origin=Song.LOCAL;

    @Index
    private
    String event="";

    private Integer index=0;

    @Index
    private
    String artist="";

    @Index
    private
    String title="";

    public LocalFile() {
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getText() {
        return text;
    }

    public Integer getOrigin() {
        return origin;
    }

    public void setOrigin(Integer origin) {
        this.origin = origin;
    }

    public void setText(String text) {
        this.text= text;
    }

    public Integer getIndex() {
        return index;
    }



    public void setIndex(Integer index) {
        this.index = index;
    }
}
