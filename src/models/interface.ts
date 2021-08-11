/*
    Contains the list of interface used to define a model
*/

export interface Thread {
    creator     :Creator;
    thread      :TDescription;
    replies?    :Array<TReplies>;
    _id?        :string;
    _token      :string;
}

export interface Creator {
    username    :string;
    avatar      :number;
    uid         :string;
}

export interface TDescription {
    title       :string;
    text        :string;
    date        :number;
}

export interface TReplies {
    username    :string;
    avatar      :number;
    time        :number;
    text        :string;
    _token      :string;
    _id?        :string;
}

//=========================================================
export interface Admin {
    username    :string;
    password    :string;
    _token      :string;
}


export interface User {
    username    :string;
    avatar      :number;
    description :string;
    _id?        :string;
    _token?     :string;
    lastreply?  :number; //last reply time, to prevent spamming
}
