/*
 * Copyright (C) 2012 SFR API - Herv� Hoareau

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

package com.weplay.shared;


import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.weplay.server.Rest;

import java.io.Serializable;


/**
 * classe de gestion des messages
 * 
 * un message peut �tre audio/video (lien http), image ou text
 * 
 * @see 
 * @author Herv� Hoareau
 *
 */
@Entity
@Cache
public class Message implements Serializable,Cloneable {

	String text="";
	public String from="";
	String title="";

    String next=null;

    @Index
    Long type= Rest.TYPE_DEMANDE;
    @Index
    public String idEvent="";

    private Boolean anonymous=false;

    private String author="";

    @Index
    public Long dtCreate=System.currentTimeMillis();

    @Id
    public String Id="Mes"+System.currentTimeMillis();

    public void setText(String text) {
        this.text = text;
    }

    public Message(){}

	/**
	 * Construction d'un message
	 * @param title titre du message
	 * @param text contenu
	 */
	public Message(User u, String title, String text) {
		this.text=text;
		this.title=title;
	}

    public Message(Message p){
        this.idEvent=p.idEvent;
        this.from=p.from;
        this.anonymous=p.anonymous;
        this.author=p.author;
        this.dtCreate=System.currentTimeMillis();
        this.Id="Mes"+p.dtCreate;
        this.type=p.type;
        this.text=p.text;
        this.title=p.title;
    }

	public Message(Event e,User u, String title, byte[] data) {
		this.setText(title);
		this.idEvent=e.Id;
	}


	public String getText(){
		return this.text;
	}
	
	public String toString(){
		return("Message : "+this.title+" contient "+this.text+" de type "+this.type+" de "+this.from);
	}

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIdEvent() {
        return idEvent;
    }

    public void setIdEvent(String idEvent) {
        this.idEvent = idEvent;
    }

    public Boolean getAnonymous() {
        return anonymous;
    }

    public void setAnonymous(Boolean anonymous) {
        this.anonymous = anonymous;
    }

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }

    public Long getDtCreate() {
        return dtCreate;
    }

    public void setDtCreate(Long dtCreate) {
        this.dtCreate = dtCreate;
    }

    public void setId() {
        this.setId("Mes"+System.currentTimeMillis());
    }

    public String getNext() {
        return next;
    }

    public void setNext(String next) {
        this.next = next;
    }


}

