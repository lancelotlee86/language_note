setup your database

CREATE TABLE entry
(
  entry_id    int         NOT NULL AUTO_INCREMENT,
  source      text        NOT NULL,
  type        char(10)    NOT NULL,
  translation text        NULL,
  note        text        NULL,
  timestamp   datetime    NOT NULL,
  PRIMARY KEY (entry_id)
);
