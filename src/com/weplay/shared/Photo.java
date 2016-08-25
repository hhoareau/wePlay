package com.weplay.shared;

import com.googlecode.objectify.annotation.IgnoreSave;
import com.googlecode.objectify.annotation.Subclass;
import com.weplay.server.Rest;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by u016272 on 14/06/2016.
 */

@Subclass(index=true)
public class Photo extends Message implements Serializable,Comparable<Photo>,Cloneable {
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

    public Photo(Photo p) {
        super(p);
        this.photo=p.photo;
        this.user=p.user;
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



    public List<Blob> split(int i) {
        String contenu=this.photo;
        this.photo="blob:";

        List<Blob> lm=new ArrayList<>();
        int size=contenu.length()/i+1;

        for(int k=0;k<i;k++) {
            int len=Math.min(size,contenu.length()-size*k);
            String id=this.getId()+"_part"+k;
            this.photo+=id+";";
            lm.add(new Blob(id,contenu.substring(k * size, k*size+len)));
        }

        return lm;
    }
}
