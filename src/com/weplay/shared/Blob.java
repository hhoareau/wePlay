package com.weplay.shared;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

import java.io.Serializable;

/**
 * Created by u016272 on 14/06/2016.
 */
@Entity
public class Blob implements Serializable {
    public String data="";

    @Id
    public String id="";

    public Blob() {
    }

    public Blob(String id,String data) {
        this.data = data;
        this.id = id;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
