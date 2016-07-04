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


import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Id;

import java.net.URLEncoder;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


/**
 * Cette classe permet de stocker le r�sultat du parsing HTML
 * 
 * @see 
 * @author Herv� Hoareau
 *
 */
@Entity
public class Lieu  {
	protected static final Logger log = Logger.getLogger(Lieu.class.getName());
	
	@Id public String Id; 													//Id interne des messages	

	@Index
    private String name;
	public String number;
	public String street;
	private String city="";
	@Index
    private String CP;
	public String logo;
	
	public Double lng=null;
	public Double lat=null;
	
	public Lieu(){}
	
	/**
	 * 
	 */
	public Lieu(String name,String address){
		this.name=name;
		address=address.replaceAll(",","");
		this.number=address.split(" ")[0];
		Matcher m=Pattern.compile("(\\d{5})").matcher(address);
		if(m.find())this.CP=m.group();
		this.street=Tools.extract(address, this.number+" ", " "+this.CP, false);
		this.setId();
	}

    public Lieu(String position) {
        this.lng=Double.valueOf(position.split(",")[0]);
        this.lat=Double.valueOf(position.split(",")[1]);
        this.name=position;
    }

    private void setId(){
		this.Id=this.CP+this.name;		
	}

	/**
	 * Fixe la position de la soir�e
	 * @param longitude
	 * @param latitude
	 */
	public void setPosition(Double longitude,Double latitude){
		this.lng=longitude;
		this.lat=latitude;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((CP == null) ? 0 : CP.hashCode());
		result = prime * result + ((number == null) ? 0 : number.hashCode());
		result = prime * result + ((street == null) ? 0 : street.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Lieu other = (Lieu) obj;
		if (CP == null) {
			if (other.CP != null)
				return false;
		} else if (!CP.equals(other.CP))
			return false;
		if (number == null) {
			if (other.number != null)
				return false;
		} else if (!number.equals(other.number))
			return false;
		if (street == null) {
			if (other.street != null)
				return false;
		} else if (!street.equals(other.street))
			return false;
		return true;
	}

	public void setPosition(String position) {
		this.lat=Double.parseDouble(position.split(",")[0]);
		this.lng=Double.parseDouble(position.split(",")[1]);
	}
	
	public Double distance(User u) {
		if(u.lat==null || u.lg==null || this.lat==null || this.lng==null) return (double) 100000000;
		return Tools.distance(u.lat,u.lg,this.lat,this.lng,'K');
	}

	public String getAddress() {
		String city=this.city;
		if(city==null)city="";
		
		return URLEncoder.encode(this.street+" "+this.street+" "+this.CP+" "+city);
	}
	
}
