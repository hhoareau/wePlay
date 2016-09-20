package com.weplay.shared;

import java.io.Serializable;

/**
 * Created by u016272 on 06/09/2016.
 */

public class Option implements Serializable {
    String lib ="";
    Double total=0.0;
    Double quot=0.0;
    public Option() {}
    public String getLib() {
        return lib;
    }
    public void setLib(String lib) {
        this.lib = lib;
    }
    public Double getTotal() {
        return total;
    }
    public void setTotal(Double total) {
        this.total = total;
    }

    public Double getQuot() {
        return quot;
    }

    public void setQuot(Double quot) {
        this.quot = quot;
    }

    public void calc(Double tGen){
        if(this.total>0)
            this.quot=tGen/this.total;
    }
}
