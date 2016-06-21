package com.weplay.shared;

import com.weplay.server.Rest;
import com.googlecode.objectify.annotation.IgnoreSave;
import com.googlecode.objectify.annotation.Subclass;

import java.io.Serializable;

/**
 * Created by u016272 on 14/06/2016.
 */

@Subclass(index=true)
public class Photo extends Message implements Serializable,Comparable<Photo> {
    public String photo="";

    @IgnoreSave
    public User user;

    public Photo() {
    }

    public Photo(String photo) {
        super();
        this.type= Rest.TYPE_MESSAGE;
        this.photo = photo;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    @Override
    public int compareTo(Photo photo) {
        if(this.dtCreate==photo.dtCreate)return 0;
        if(this.dtCreate<photo.dtCreate)return 1;
        return -1;
    }
}
