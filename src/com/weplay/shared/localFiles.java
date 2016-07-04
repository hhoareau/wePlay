package com.weplay.shared;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by u016272 on 02/07/2016.
 */
public class localFiles implements Serializable {
    private List<LocalFile> files=new ArrayList<LocalFile>();

    public localFiles() {
    }

    public List<LocalFile> getFiles() {
        return files;
    }

    public void setFiles(List<LocalFile> files) {
        this.files = files;
    }
}
