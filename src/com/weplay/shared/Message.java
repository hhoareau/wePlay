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


import com.weplay.server.Rest;
import com.google.appengine.api.images.Composite;
import com.google.appengine.api.images.Composite.Anchor;
import com.google.appengine.api.images.Image;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.urlfetch.URLFetchServiceFactory;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.Part;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;


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
public class Message implements Serializable {

	public String text="";											//corps du mail
	public String from="";								//Expediteur de l'email
	public String title="";

    @Index
    public Long dtMessage=null;				//Date de fabrication du mail
	@Index
    public Long type= Rest.TYPE_DEMANDE;
    @Index
    public String idEvent="";

    public Boolean anonymous=false;

    public String author="";
    public Long dtCreate=System.currentTimeMillis();

    @Id
    public String Id="Message"+System.currentTimeMillis();
	
	/**
	 * Methode utilis� pour convertire un flux is en Message

	//Notamment utilis� en retour de l'API de r�cup�ration des mails
	public Message(InputStream is,String replace,String separator_enreg,User u) {
		String s=convertStreamToString(is);
		
		if(replace!=null)
			for(String ss:replace.split(","))
				s=s.replace("<<"+ss.split("=")[0]+">>", ss.split("=")[1]);

		//Constitution du corps du Message
		//5000 est le nombre maximum de caract�res
		
		Long dtDoc=Tools.StringToDate(extract(s,separator_enreg+"date=",separator_enreg,true));
		if(dtDoc!=null)
			this.dtMessage=dtDoc*1000;
		else
			Tools.log.info("Date de Message introuvable pour "+this);
				
		List<String> emails=Tools.findMail(extract(s,"from=",separator_enreg,true));
		if(emails.size()>0)this.setId(u);
		
		this.setText(extract(s,separator_enreg+"subject=",separator_enreg,true));
		
	}
	*/
	
	/*
	public void setMultipart(Multipart multipart){

	}
	*/
	
	/**
	 * Contruit un Message a partir d'un mail recu
	 * @param message contient le message
	 */
	public Message(MimeMessage message,User u,Event e){				
		try {
			this.dtMessage=message.getSentDate().getTime();
			this.idEvent=e.Id;
			this.title=message.getSubject();
			this.from=u.email;
			
			if(message.isMimeType("multipart/*")){
				this.setText(message.getSubject());

                try {
                    Multipart multipart=(Multipart) message.getContent();
                    for (int i = 0; i < multipart.getCount(); i++) {
                        BodyPart textPart = multipart.getBodyPart(i);

                        //TODO a regarder pour un envoi de video
                        if(!Part.ATTACHMENT.equalsIgnoreCase(textPart.getDisposition())) {
                            this.setText(textPart.getContent().toString());
                            continue;
                        }

                        InputStream is = textPart.getInputStream();
                        //this.photo=Base64.encode(compress(Tools.convertStreamToByte(is),1000));
                        this.type=Rest.TYPE_MESSAGE;
                    }
                } catch (MessagingException ee) {
                    ee.printStackTrace();
                }

                //setMultipart();
			}
			else this.setText(message.getSubject()+" "+message.getContent().toString());
			
		} catch (MessagingException | IOException ee) {
			ee.printStackTrace();
		}					
	}
	
	
	private void setText(String text) {
		if(text!=null){
			if(!text.startsWith("javax.mail.internet") && text.length()>0)this.text=text;
		}
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

    /*
	public byte[] compress(byte[] data,Integer size){
		ImagesService is = ImagesServiceFactory.getImagesService();
		Image oldImage=ImagesServiceFactory.makeImage(data);
		
		// compress & resize it
		OutputSettings settings = new OutputSettings(ImagesService.OutputEncoding.JPEG);
		settings.setQuality(70);
		Transform resize = ImagesServiceFactory.makeResize(size, size); 
		
		Image newImage = is.applyTransform(resize, oldImage, settings);
		
		return newImage.getImageData();
		
	}
	*/


	public Message(Event e,User u, String title, byte[] data) {
		this.setText(title);
		this.idEvent=e.Id;
		
		//if(data!=null && data.length>500) //TODO a revoir comme critere
			//this.photo=Base64.encode(compress(data,1000));
	}



	/**
	 * Construit un message sur la base d'une demande
	 * @param d
	 * @throws IOException 
	 * @throws MalformedURLException 
	 */
	public Message(Demande d,User from,User to) throws MalformedURLException, IOException {
		this.from=d.from;
		
		if(d.reponse==null)
			this.text=from.name+" demande un "+d.nature+" � "+to.name;
		else
			if(d.reponse)
				this.text=to.name+" accept le "+d.nature+" de "+from.name;
			else
				this.text=to.name+" refuse le "+d.nature+" de "+from.name;
		
		
		this.type=Rest.TYPE_MESSAGE;
		this.idEvent=d.event_id;
		this.title=d.nature;
		
		//ImagesService is = ImagesServiceFactory.getImagesService();
		
		byte[] data=null;
				
		if(d.photo.startsWith("http")){
			Image icon=ImagesServiceFactory.makeImage(URLFetchServiceFactory.getURLFetchService().fetch(new URL(d.photo)).getContent());
			Image imgFrom=ImagesServiceFactory.makeImage(URLFetchServiceFactory.getURLFetchService().fetch(new URL(from.photo)).getContent());
			Image imgTo=ImagesServiceFactory.makeImage(URLFetchServiceFactory.getURLFetchService().fetch(new URL(to.photo)).getContent());
			
			//icon.setImageData(compress(icon.getImageData(),150));
			
			ArrayList<Composite> lc=new ArrayList<Composite>();
			lc.add(ImagesServiceFactory.makeComposite(icon, 0, 0, 1, Anchor.CENTER_CENTER));
			lc.add(ImagesServiceFactory.makeComposite(imgFrom, -100, -100, 1, Anchor.CENTER_CENTER));
			lc.add(ImagesServiceFactory.makeComposite(imgTo, 100, 100, 1, Anchor.CENTER_CENTER));
			Image c=ImagesServiceFactory.getImagesService().composite(lc, 300, 300, 0);
			//this.photo= Base64.encode(c.getImageData());
		}
	}
	

	public String getText(){
		return this.text;
	}
	
	public String toString(){
		return("Message : "+this.title+" contient "+this.text+" de type "+this.type+" de "+this.from+" produit le "+Tools.getDate(this.dtMessage));
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

    public Long getDtMessage() {
        return dtMessage;
    }

    public void setDtMessage(Long dtMessage) {
        this.dtMessage = dtMessage;
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

}

