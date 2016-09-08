package com.weplay.shared;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Subclass;

import java.util.ArrayList;

/**
 * Created by u016272 on 06/09/2016.
 */
@Subclass(index=true)
@Cache
public class Sondage extends Message {

    public ArrayList<String> votants=new ArrayList<String>();

    public Sondage() {
    }

    public ArrayList<String> getVotants() {
        return votants;
    }

    public void setVotants(ArrayList<String> votants) {
        this.votants = votants;
    }
}
