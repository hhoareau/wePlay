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

import java.io.Serializable;

public class Vote implements Serializable {

	private static final long serialVersionUID = 1440513031923567299L;

	//@Id public String Id; 					//Id interne des Users (adresse email)

    public User from;						//Nom du User
	public Long dtVote=System.currentTimeMillis();
    public Double value =0.0;
    public String description="";


    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public Vote(){}


    public Long getDtVote() {
        return dtVote;
    }

    public void setDtVote(Long dtVote) {
        this.dtVote = dtVote;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
