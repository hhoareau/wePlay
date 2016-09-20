package com.weplay.shared;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Subclass;
import com.sun.org.apache.xpath.internal.operations.Bool;
import com.weplay.server.Rest;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

;


@Subclass(index=true)
@Cache
public class Bet extends Message {

    Double total=0.0;

    @Index
    Long dtEnd=null;

    @Index
    Long dtStart=System.currentTimeMillis();

    @Index
            Boolean closed=false;

    List<Option> options=new ArrayList<>();

    /**
     * Construction d'un message
     * @param u
     * @param title titre du message
     */
    public Bet(User u, String title, String options,Long delay) {
        super(u, title,"");
        this.type= Rest.TYPE_BET;
        this.dtEnd=this.dtStart+delay*1000L*60L;
    }

    public Bet() {
        this.type=Rest.TYPE_BET;
    }

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public Long getDtEnd() {
        return dtEnd;
    }

    public void setDtEnd(Long dtEnd) {
        this.dtEnd = dtEnd;
    }

    public Long getDtStart() {
        return dtStart;
    }

    public void setDtStart(Long dtStart) {
        this.dtStart = dtStart;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    @Override
    public boolean addVote(Vote v) {
        if(this.dtStart<System.currentTimeMillis() && this.dtEnd>System.currentTimeMillis())
            if(super.addVote(v)){
                Option o=this.options.get(Integer.parseInt(v.description));
                o.total+=v.getValue();
                this.total+=v.getValue();
                o.calc(this.total);
                return true;
            }

        return false;
    }

    /*
    public Map<Integer,Double> getEnjeuGagnant(){
        Map<Integer,Double> sum=new HashMap<>();
        for(Vote v:this.votes){
            int opt=Integer.parseInt(v.getDescription());
            sum.put(opt,sum.get(opt)+v.getValue());
        }
        return sum;
    }
    */

    public Boolean getClosed() {
        return closed;
    }

    public void setClosed(Boolean closed) {
        this.closed = closed;
    }

    public Double getScore(Integer index, Vote v) {
        if(index==Integer.parseInt(v.getDescription()))
            return v.getValue()*this.options.get(index).getQuot();
        else
            return 0.0;
    }
}
