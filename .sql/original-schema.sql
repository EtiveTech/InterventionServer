--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: c4a_i_schema; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA c4a_i_schema;


ALTER SCHEMA c4a_i_schema OWNER TO postgres;

--
-- Name: SCHEMA c4a_i_schema; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA c4a_i_schema IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = c4a_i_schema, pg_catalog;

--
-- Name: color_state; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE color_state AS ENUM (
  'GREEN',
  'WHITE',
  'YELLOW',
  'RED'
);


ALTER TYPE c4a_i_schema.color_state OWNER TO postgres;

--
-- Name: frailty_detint_status; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE frailty_detint_status AS ENUM (
  'completed',
  'suspended',
  'needed',
  'in progress'
);


ALTER TYPE c4a_i_schema.frailty_detint_status OWNER TO postgres;

--
-- Name: intervention_status; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE intervention_status AS ENUM (
  'suspended',
  'completed',
  'to be done',
  'working',
  'active'
);


ALTER TYPE c4a_i_schema.intervention_status OWNER TO postgres;

--
-- Name: messages_status; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE messages_status AS ENUM (
  'sent',
  'scheduled',
  'error',
  'to send - updated',
  'to send'
);


ALTER TYPE c4a_i_schema.messages_status OWNER TO postgres;

--
-- Name: predel_messages_status; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE predel_messages_status AS ENUM (
  'success',
  'waiting',
  'failed'
);


ALTER TYPE c4a_i_schema.predel_messages_status OWNER TO postgres;

--
-- Name: symbol_status; Type: TYPE; Schema: c4a_i_schema; Owner: postgres
--

CREATE TYPE symbol_status AS ENUM (
  '-',
  '--',
  '+',
  '++'
);


ALTER TYPE c4a_i_schema.symbol_status OWNER TO postgres;

--
-- Name: export_channels(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_channels(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  -- Export of the table channel
  EXECUTE format($$COPY c4a_i_schema.channel(channel_id, channel_name)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'Channels successfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_channels(filepath character varying) OWNER TO postgres;

--
-- Name: export_hourperiods(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_hourperiods(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  -- Export of the table hour_period
  EXECUTE format($$COPY c4a_i_schema.hour_period(hour_period_name, hour_period_start, hour_period_end)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'Hour periods successfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_hourperiods(filepath character varying) OWNER TO postgres;

--
-- Name: export_messages(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_messages(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Support variable used to insert the channels of each message
DECLARE mes_ch character varying (25);

BEGIN

  -- message_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.message_temporary
  (
    resource_id character varying(25),
    resource_name character varying(200),
    category character varying(25),
    description character varying(1200),
    message_id character varying(25) NOT NULL,
    text character varying(1200) NOT NULL,
    media character varying(200),
    url character varying(200),
    video character varying(200),
    audio character varying(200),
    semantic_type character varying(50),
    communication_style character varying(50),
    is_compulsory boolean,
    channels character varying (50)
  );

  -- message_has_channel_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.mhc_temporary
  (
    message_id character varying(25),
    channel_id integer,
    channel_name character varying(25)
  );

  -- Inserting the data into the temporary table from the message table
  INSERT INTO c4a_i_schema.message_temporary(message_id, text, media, url, video, audio, semantic_type, communication_style, is_compulsory)
    SELECT message_id, text, media, url, video, audio, semantic_type, communication_style, is_compulsory
    FROM c4a_i_schema.message;

  -- Inserting through an update the data about the resource (id, name, category, description)
  UPDATE c4a_i_schema.message_temporary AS mt
  SET resource_id = r.resource_id,
    resource_name = r.resource_name,
    category = r.category,
    description = r.description
  FROM c4a_i_schema.resource AS r, c4a_i_schema.resource_has_messages AS rhs
  WHERE r.resource_id = rhs.resource_id AND mt.message_id = rhs.message_id;

  -- Inserting through an update the data about the channels
  FOR mes_ch IN (SELECT message_id
                 FROM c4a_i_schema.message_temporary)
  LOOP
    UPDATE c4a_i_schema.message_temporary AS mt
    SET channels = agg.chan
    FROM (SELECT string_agg(channel_name, ', ') AS chan
          FROM c4a_i_schema.channel AS c, c4a_i_schema.message_has_channel AS mhc
          WHERE c.channel_id = mhc.channel_id AND mhc.message_id = mes_ch
          GROUP BY mhc.message_id) AS agg
    WHERE mt.message_id = mes_ch;
  END LOOP;

  -- Exporting the file
  EXECUTE format($$COPY c4a_i_schema.message_temporary (resource_id, category, resource_name, description, message_id, text, url, media, audio, video, channels, semantic_type, communication_style, is_compulsory)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'Messages successfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_messages(filepath character varying) OWNER TO postgres;

--
-- Name: export_prescriptions(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_prescriptions(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  -- Create temporary table to manage the export
  CREATE TABLE IF NOT EXISTS c4a_i_schema.prescription_temporary
  (
    aged_id integer,
    aged_id_pretty character varying(50),
    geriatrician_id integer,
    geriatrician_id_pretty character varying(50),
    text character varying(2500),
    additional_notes character varying(500),
    valid_from date,
    valid_to date,
    urgency c4a_i_schema.color_state,
    prescription_id serial NOT NULL,
    title character varying(45),
    prescription_status c4a_i_schema.intervention_status,
    prescription_id_pretty character varying(50),
    CONSTRAINT pk_prescription_temp PRIMARY KEY (prescription_id)
  );

  -- Insert the data from the prescription table to the temporary table
  INSERT INTO c4a_i_schema.prescription_temporary(aged_id, geriatrician_id, text, additional_notes, valid_from, valid_to, urgency, title, prescription_status, prescription_id_pretty)
    SELECT aged_id, geriatrician_id, text, additional_notes, valid_from, valid_to, urgency, title, prescription_status, prescription_id_pretty
    FROM c4a_i_schema.prescription;

  -- Update to add the geriatrician_id using the geriatrician_id_pretty to retrieve it
  UPDATE c4a_i_schema.prescription_temporary AS ptemp
  SET aged_id_pretty = p.aged_id_pretty
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id = ptemp.aged_id;

  -- Update to add the aged_id using the aged_id_pretty to retrieve it
  UPDATE c4a_i_schema.prescription_temporary AS ptemp
  SET geriatrician_id_pretty = u.user_id_pretty
  FROM c4a_i_schema.user AS u
  WHERE u.user_id = ptemp.geriatrician_id;

  -- Execute COPY to import the file into the temporary table
  EXECUTE format($$COPY c4a_i_schema.prescription_temporary (aged_id_pretty, valid_from, valid_to, text, prescription_id_pretty, urgency, geriatrician_id_pretty, additional_notes, title, prescription_status)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'Prescriptions successfully exported';

  DROP TABLE c4a_i_schema.prescription_temporary;

END;$_$;


ALTER FUNCTION c4a_i_schema.export_prescriptions(filepath character varying) OWNER TO postgres;

--
-- Name: export_profiles(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_profiles(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  EXECUTE format($$COPY c4a_i_schema.profile(aged_id_pretty, name, surname, date_of_birth, profile_type, age, sex)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);


  RAISE NOTICE 'Profiles succesfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_profiles(filepath character varying) OWNER TO postgres;

--
-- Name: export_profiles_communicative(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_profiles_communicative(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.pcd_temporary

  (
    aged_id integer,
    communication_style character varying(25),
    message_frequency character varying(15),
    topics character varying(125),
    available_channels character varying(45),
    aged_id_pretty character varying(50),
    hour_preferences character varying (15),
    hour_id integer,
    CONSTRAINT pk_communicativedetails_temporary PRIMARY KEY (aged_id_pretty)
  );

  -- Insert of the communicative details of a profile into the temporary table
  INSERT INTO c4a_i_schema.pcd_temporary(aged_id, communication_style, message_frequency, topics, available_channels, aged_id_pretty)
    SELECT aged_id, communication_style, message_frequency, topics, available_channels, aged_id_pretty
    FROM c4a_i_schema.profile_communicative_details;

  -- Updating the temporary table to include the hour_period id taken from the hour_period table
  UPDATE c4a_i_schema.pcd_temporary
  SET hour_preferences = hp.hour_period_name
  FROM c4a_i_schema.hour_period AS hp, c4a_i_schema.profile_hour_preferences AS php
  WHERE hp.hour_period_id = php.hour_period_id AND php.aged_id = pcd_temporary.aged_id;

  -- Export of the temporary communicative details temporary table into a csv file
  EXECUTE format($$COPY c4a_i_schema.pcd_temporary(aged_id_pretty, communication_style, message_frequency, topics, available_channels, hour_preferences)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Drop the temporary table
  DROP TABLE c4a_i_schema.pcd_temporary;

  RAISE NOTICE 'Communicative details of the profiles successfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_profiles_communicative(filepath character varying) OWNER TO postgres;

--
-- Name: export_profiles_frailty(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_profiles_frailty(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  EXECUTE format($$COPY c4a_i_schema.profile_frailty_status(aged_id_pretty, frailty_status_overall,
					frailty_status_lastperiod, frailty_notice, frailty_textline, frailty_attention,
					last_detection_date, last_intervention_date, detection_status, intervention_status,
					frailty_status_text, frailty_status_number)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);


  RAISE NOTICE 'Frailty Status of the profiles succesfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_profiles_frailty(filepath character varying) OWNER TO postgres;

--
-- Name: export_profiles_socioeconomic(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_profiles_socioeconomic(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  EXECUTE format($$COPY c4a_i_schema.profile_socioeconomic_details(aged_id, financial_situation, married, education_level, languages, personal_interests)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);


  RAISE NOTICE 'Socioeconomic Details of the profiles succesfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_profiles_socioeconomic(filepath character varying) OWNER TO postgres;

--
-- Name: export_profiles_tech(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_profiles_tech(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  EXECUTE format($$COPY c4a_i_schema.profile_technical_details(aged_id_pretty, address, telephone_home_number, mobile_phone_number, email, facebook_account, telegram_account)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);


  RAISE NOTICE 'Technical details of the profiles succesfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_profiles_tech(filepath character varying) OWNER TO postgres;

--
-- Name: export_resources(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_resources(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$DECLARE res_subj character varying (25);
  DECLARE list_subjects character varying(500);
  DECLARE test record;

BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.resource_temporary
  (
    oid integer NOT NULL DEFAULT nextval('c4a_i_schema.resource_oid_seq'::regclass),
    resource_id character varying(25) NOT NULL,
    resource_name character varying(200) NOT NULL,
    category character varying(25) NOT NULL,
    description character varying(1200) NOT NULL,
    media character varying(200),
    url character varying(200),
    language character varying(25),
    authoritativeness character varying(25),
    from_date date,
    to_date date,
    addressed_to character varying(50),
    partner character varying(50),
    translated boolean,
    has_messages boolean,
    periodic boolean,
    repeating_time character varying(25),
    repeating_every integer,
    repeating_on_day character varying(50),
    subjects character varying(200),
    CONSTRAINT pk_resource_temporary PRIMARY KEY (resource_id)
  );

  -- Insert the data of the table resource into the table resource_temporary
  INSERT INTO c4a_i_schema.resource_temporary(resource_id, partner, language, category, resource_name, url, description,
                                              from_date, to_date, media, has_messages, translated, periodic, repeating_time,
                                              repeating_every, repeating_on_day)
    SELECT resource_id, partner, language, category, resource_name, url, description, from_date, to_date,
      media, has_messages, translated, periodic, repeating_time, repeating_every, repeating_on_day
    FROM c4a_i_schema.resource;

  FOR res_subj IN (SELECT resource_id
                   FROM c4a_i_schema.resource_temporary)
  LOOP
    UPDATE c4a_i_schema.resource_temporary AS rt
    SET subjects = agg.subjs
    FROM (SELECT string_agg(subject_name, ', ') AS subjs
          FROM c4a_i_schema.subject AS s, c4a_i_schema.resource_has_subjects AS rhs
          WHERE s.subject_id = rhs.subject_id AND rhs.resource_id = res_subj
          GROUP BY rhs.resource_id) AS agg
    WHERE rt.resource_id = res_subj;
  END LOOP;


  -- Export the resource_temporary table into a CSV file
  EXECUTE format($$COPY c4a_i_schema.resource_temporary (resource_id, partner, language, category,
resource_name, subjects,url, description, from_date, to_date, media, has_messages, translated, periodic,
repeating_time, repeating_every, repeating_on_day)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  DROP TABLE c4a_i_schema.resource_temporary;
  RAISE NOTICE 'Resources succesfully exported';
END;$_$;


ALTER FUNCTION c4a_i_schema.export_resources(filepath character varying) OWNER TO postgres;

--
-- Name: export_templates(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_templates(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$DECLARE temp_channel character varying (25);

BEGIN

  -- Creation of temporary tables to handle the import

  CREATE TABLE IF NOT EXISTS c4a_i_schema.template_temporary
  (
    template_id character varying(25),
    title character varying(150),
    description character varying(1500),
    flowchart json,
    period integer,
    min_number_messages integer,
    max_number_messages integer,
    compulsory character varying(75),
    addressed_to character varying(75),
    category character varying(50),
    channels character varying (100),
    CONSTRAINT pk_template_temporary PRIMARY KEY (template_id)
  );

  -- Insert the template that there is not in the template table
  INSERT INTO c4a_i_schema.template_temporary(template_id, category, title, description, min_number_messages, max_number_messages, period)
    SELECT  template_id, category, title, description, min_number_messages, max_number_messages, period
    FROM c4a_i_schema.template;

  -- Insert of the channels related to a template
  FOR temp_channel IN (SELECT template_id
                       FROM c4a_i_schema.template_temporary)
  LOOP
    UPDATE c4a_i_schema.template_temporary AS tt
    SET channels = agg.chann
    FROM (SELECT string_agg(channel_name, ', ') AS chann
          FROM c4a_i_schema.channel AS c, c4a_i_schema.template_has_channel AS ths
          WHERE c.channel_id = ths.channel_id AND ths.template_id = temp_channel
          GROUP BY ths.template_id) AS agg
    WHERE tt.template_id = temp_channel;
  END LOOP;

  -- Export of the template_temporary table into the file
  EXECUTE format($$COPY c4a_i_schema.template_temporary (template_id, category, title, description, min_number_messages, max_number_messages, period, channels)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Print a message to say that the export has succeded
  RAISE NOTICE 'Templates correctly exported';

  -- Drop the temporary tables
  DROP TABLE c4a_i_schema.template_temporary;

END;$_$;


ALTER FUNCTION c4a_i_schema.export_templates(filepath character varying) OWNER TO postgres;

--
-- Name: export_users(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION export_users(filepath character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  -- Export of the table User into a file
  EXECUTE format($$COPY c4a_i_schema.user(name, surname, password, role, permission_type, email, mobilephone_number, user_id_pretty)
TO %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'Users successfully exported';

END;$_$;


ALTER FUNCTION c4a_i_schema.export_users(filepath character varying) OWNER TO postgres;

--
-- Name: import_channels(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_channels(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate over the temporary
DECLARE channel_to_check integer;

BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.channel_temporary
  (
    channel_id integer NOT NULL,
    channel_name character varying(25) NOT NULL
  );

  -- Import of the file into the channel_temporary table
  EXECUTE format($$COPY c4a_i_schema.channel_temporary(channel_id, channel_name)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  FOR channel_to_check IN (SELECT channel_id
                           FROM c4a_i_schema.channel_temporary)
  LOOP
    -- Check if a channel exists or not in the database
    IF NOT EXISTS (SELECT channel_id
                   FROM c4a_i_schema.channel
                   WHERE channel_id = channel_to_check) THEN
      -- If not exists, then perform the insert
      INSERT INTO c4a_i_schema.channel(channel_id, channel_name)
        SELECT channel_id, channel_name
        FROM c4a_i_schema.channel_temporary AS ct_insert
        WHERE ct_insert.channel_id = channel_to_check;
    ELSE
      -- The channel already exists in the database, so it is updated
      UPDATE c4a_i_schema.channel AS c
      SET channel_id = ct_update.channel_id,
        channel_name = ct_update.channel_name
      FROM c4a_i_schema.channel_temporary AS ct_update
      WHERE c.channel_id = ct_update.channel_id
            AND ct_update.channel_id = channel_to_check;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.channel_temporary;

  RAISE NOTICE 'Channels successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_channels(file_path character varying) OWNER TO postgres;

--
-- Name: import_hourperiods(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_hourperiods(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$---- Variable to iterate over the temporary
DECLARE hp_to_check character varying(15);

BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.hp_temporary
  (
    hour_period_name character varying(15),
    hour_period_start time without time zone,
    hour_period_end time without time zone
  );

  -- Import of the file into the hour_period temporary table
  EXECUTE format($$COPY c4a_i_schema.hp_temporary(hour_period_name, hour_period_start, hour_period_end)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  FOR hp_to_check IN (SELECT hour_period_name
                      FROM c4a_i_schema.hour_period)
  LOOP
    -- Check if a hour_period exists or not in the database
    IF NOT EXISTS (SELECT hour_period_name
                   FROM c4a_i_schema.hour_period
                   WHERE hour_period_name = hp_to_check) THEN
      -- If not exists, then perform the insert
      INSERT INTO c4a_i_schema.hour_period(hour_period_name, hour_period_start, hour_period_end)
        SELECT hour_period_name, hour_period_start, hour_period_end
        FROM c4a_i_schema.hp_temporary AS hp_insert
        WHERE hp_insert.hour_period_name = hp_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.hour_period AS hp
      SET hour_period_name = hp_update.hour_period_name,
        hour_period_start = hp_update.hour_period_start,
        hour_period_end = hp_update.hour_period_end
      FROM c4a_i_schema.hp_temporary AS hp_update
      WHERE c.hour_period_name = hp_update.hour_period_name
            AND hp_update.hour_period_name = hp_to_check;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.hp_temporary;

  RAISE NOTICE 'Hour periods successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_hourperiods(file_path character varying) OWNER TO postgres;

--
-- Name: import_messages(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_messages(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to check if a message is already inserted or not
DECLARE message_to_check character varying (25);
  -- Variables to check the relationship between messages and channels
  DECLARE message_m character varying(25);
  DECLARE channel_c integer;

BEGIN

  -- Create the message_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.message_temporary
  (
    resource_id character varying(25),
    resource_name character varying(200),
    category character varying(25),
    description character varying(1200),
    message_id character varying(25) NOT NULL,
    text character varying(1200) NOT NULL,
    media character varying(200),
    url character varying(200),
    video character varying(200),
    audio character varying(200),
    semantic_type character varying(50),
    communication_style character varying(50),
    is_compulsory boolean,
    channels character varying (50)
  );

  -- Create the message_has_channel_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.mhc_temporary
  (
    message_id character varying(25),
    channel_id integer,
    channel_name character varying(25)
  );

  -- Import of the file into message_temporary
  EXECUTE format($$COPY c4a_i_schema.message_temporary(resource_id, category, resource_name, description, message_id, text, url, media, audio, video, channels, semantic_type, communication_style, is_compulsory)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  --Insert/Update of the messages from the message_temporary table into the message table
  FOR message_to_check IN (SELECT message_id
                           FROM c4a_i_schema.message_temporary)
  LOOP
    --If a message does not exists it is inserted in the message table and
    -- also its relationship with the resource is inserted in resource_has_messages table
    IF NOT EXISTS (SELECT message_id FROM c4a_i_schema.message WHERE message_id = message_to_check) THEN
      -- Insert of the message
      INSERT INTO c4a_i_schema.message(message_id, text, media, url, video, audio, semantic_type, communication_style, is_compulsory)
        SELECT message_id, text, media, url, video, audio, semantic_type, communication_style, is_compulsory
        FROM c4a_i_schema.message_temporary AS mt_insert
        WHERE mt_insert.message_id = message_to_check;
      -- Insert of the relationship into resource_has_messages table
      INSERT INTO c4a_i_schema.resource_has_messages(resource_id, message_id)
        SELECT resource_id, message_id
        FROM c4a_i_schema.message_temporary AS mt
        WHERE message_id = message_to_check;

    ELSE
      --Update of the message
      UPDATE c4a_i_schema.message AS mup
      SET message_id = mtupdate.message_id,
        text = mtupdate.text,
        media = mtupdate.media,
        url = mtupdate.url,
        video = mtupdate.video,
        audio = mtupdate.audio,
        semantic_type = mtupdate.semantic_type,
        communication_style = mtupdate.communication_style,
        is_compulsory = mtupdate.is_compulsory
      FROM c4a_i_schema.message_temporary AS mtupdate
      WHERE mup.message_id = mtupdate.message_id AND mtupdate.message_id = message_to_check;
    END IF;
  END LOOP;

  -- Import of the relationships into mhc_temporary
  INSERT INTO c4a_i_schema.mhc_temporary(message_id, channel_name)
    SELECT mt.message_id, a
    FROM c4a_i_schema.message_temporary AS mt, regexp_split_to_table(mt.channels, ', ') AS a;

  -- Updating the relationships to include the channel_id
  UPDATE c4a_i_schema.mhc_temporary AS mhc
  SET channel_id = c.channel_id
  FROM c4a_i_schema.channel AS c
  WHERE c.channel_name = mhc.channel_name;

  -- Check if the relationship between messages and channels already exist in the database
  FOR message_m, channel_c IN (SELECT message_id, channel_id
                               FROM c4a_i_schema.mhc_temporary)
  LOOP
    IF NOT EXISTS (SELECT message_id, channel_id
                   FROM c4a_i_schema.message_has_channel
                   WHERE message_id = message_m AND channel_id = channel_c) THEN
      -- Insert of the relationships into message_has_channel if it not exists
      INSERT INTO c4a_i_schema.message_has_channel(message_id, channel_id)
        SELECT message_id, channel_id
        FROM c4a_i_schema.mhc_temporary
        WHERE message_id = message_m AND channel_id = channel_c;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.message_temporary;
  DROP TABLE c4a_i_schema.mhc_temporary;

  RAISE NOTICE 'Messages imported succesfully';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_messages(file_path character varying) OWNER TO postgres;

--
-- Name: import_prescriptions(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_prescriptions(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate over the prescription temporary table
DECLARE prescription_to_check character varying(50);

BEGIN

  -- Create the prescription_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.prescription_temporary
  (
    aged_id integer,
    aged_id_pretty character varying(50),
    geriatrician_id integer,
    geriatrician_id_pretty character varying(50),
    text character varying(2500),
    additional_notes character varying(500),
    valid_from date,
    valid_to date,
    urgency c4a_i_schema.color_state,
    prescription_id serial NOT NULL,
    title character varying(45),
    prescription_status c4a_i_schema.intervention_status,
    prescription_id_pretty character varying(50),
    CONSTRAINT pk_prescription_temp PRIMARY KEY (prescription_id)
  );

  -- Execute COPY to import the file into the temporary table
  EXECUTE format($$COPY c4a_i_schema.prescription_temporary (aged_id_pretty, valid_from, valid_to, text, prescription_id_pretty, urgency, geriatrician_id_pretty, additional_notes, title, prescription_status)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Update to add the geriatrician_id using the geriatrician_id_pretty to retrieve it
  UPDATE c4a_i_schema.prescription_temporary AS ptemp
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = ptemp.aged_id_pretty;

  -- Update to add the aged_id using the aged_id_pretty to retrieve it
  UPDATE c4a_i_schema.prescription_temporary AS ptemp
  SET geriatrician_id = u.user_id
  FROM c4a_i_schema.user AS u
  WHERE u.user_id_pretty = ptemp.geriatrician_id_pretty;

  -- Iterate over all the prescription in the temporary table
  FOR prescription_to_check IN (SELECT prescription_id_pretty
                                FROM c4a_i_schema.prescription_temporary)
  LOOP
    -- Check if a prescription exists or not in the database
    IF NOT EXISTS (SELECT prescription_id_pretty
                   FROM c4a_i_schema.prescription
                   WHERE prescription_id_pretty = prescription_to_check) THEN
      -- If not exists, then perform the insert
      INSERT INTO c4a_i_schema.prescription(aged_id, geriatrician_id, text, additional_notes, valid_from, valid_to, urgency, title, prescription_status, prescription_id_pretty)
        SELECT aged_id, geriatrician_id, text, additional_notes, valid_from, valid_to, urgency, title, prescription_status, prescription_id_pretty
        FROM c4a_i_schema.prescription_temporary AS p_insert
        WHERE p_insert.prescription_id_pretty = prescription_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.prescription AS p
      SET aged_id = p_update.aged_id,
        geriatrician_id = p_update.geriatrician_id,
        text = p_update.text,
        additional_notes = p_update.additional_notes,
        valid_from = p_update.valid_from,
        valid_to = p_update.valid_to,
        urgency = p_update.urgency,
        title = p_update.title,
        prescription_status = p_update.prescription_status,
        prescription_id_pretty = p_update.prescription_id_pretty
      FROM c4a_i_schema.prescription_temporary AS p_update
      WHERE p_update.prescription_id_pretty = prescription_to_check
            AND p.prescription_id_pretty = p_update.prescription_id_pretty;
    END IF;
  END LOOP;

  RAISE NOTICE 'Prescriptions successfully inserted';

  DROP TABLE c4a_i_schema.prescription_temporary;

END;$_$;


ALTER FUNCTION c4a_i_schema.import_prescriptions(file_path character varying) OWNER TO postgres;

--
-- Name: import_profile(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_profile(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate over the temporary
DECLARE profile_to_check character varying(50);

BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.profile_temporary
  (
    name character varying(50),
    surname character varying(45),
    date_of_birth date,
    profile_type character varying(50),
    sex character varying(10),
    aged_id_pretty character varying(50),
    age integer
  );

  -- Import of the file into the profile temporary table
  EXECUTE format($$COPY c4a_i_schema.profile_temporary(aged_id_pretty, name, surname, date_of_birth, profile_type, age, sex)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Iterate over all the profiles in the temporary table
  FOR profile_to_check IN (SELECT aged_id_pretty
                           FROM c4a_i_schema.profile_temporary)
  LOOP
    -- Check if a profile exists or not in the database
    IF NOT EXISTS (SELECT aged_id_pretty
                   FROM c4a_i_schema.profile
                   WHERE aged_id_pretty = profile_to_check) THEN
      INSERT INTO c4a_i_schema.profile(name, surname, date_of_birth, profile_type,
                                       sex, aged_id_pretty, age)
        SELECT  name, surname, date_of_birth, profile_type,
          sex, aged_id_pretty, age
        FROM c4a_i_schema.profile_temporary AS p_insert
        WHERE p_insert.aged_id_pretty = profile_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.profile AS p
      SET name = p_update.name,
        surname = p_update.surname,
        date_of_birth = p_update.date_of_birth,
        profile_type = p_update.profile_type,
        sex = p_update.sex,
        aged_id_pretty = p_update.aged_id_pretty,
        age = p_update.age
      FROM c4a_i_schema.profile_temporary AS p_update
      WHERE p_update.aged_id_pretty = p.aged_id_pretty
            AND p_update.aged_id_pretty = profile_to_check;
    END IF;
  END LOOP;

  RAISE NOTICE 'Profile successfully imported';

  DROP TABLE c4a_i_schema.profile_temporary;

END;$_$;


ALTER FUNCTION c4a_i_schema.import_profile(file_path character varying) OWNER TO postgres;

--
-- Name: import_profile_communicative_details(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_profile_communicative_details(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate over the temporary
DECLARE p_to_check character varying (50);

  -- Variable to iterate over the hour_preferences
  DECLARE profile_p integer;
  DECLARE hour_h integer;

BEGIN

  -- Create table to manage the import
  CREATE TABLE IF NOT EXISTS c4a_i_schema.pcd_temporary
  (
    aged_id integer,
    communication_style character varying(25),
    message_frequency character varying(15),
    topics character varying(125),
    available_channels character varying(45),
    aged_id_pretty character varying(50),
    hour_preferences character varying (15),
    hour_id integer,
    CONSTRAINT pk_communicativedetails_temporary PRIMARY KEY (aged_id_pretty)
  );

  -- Import of the file into the temporary communicative details temporary table
  EXECUTE format($$COPY c4a_i_schema.pcd_temporary(aged_id_pretty, communication_style, message_frequency, topics, available_channels, hour_preferences)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Updating the temporary table to include the aged_id taken from the profile table
  UPDATE c4a_i_schema.pcd_temporary
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = pcd_temporary.aged_id_pretty;

  -- Updating the temporary table to include the hour_period id taken from the hour_period table
  UPDATE c4a_i_schema.pcd_temporary
  SET hour_id = hp.hour_period_id
  FROM c4a_i_schema.hour_period AS hp
  WHERE hp.hour_period_name = pcd_temporary.hour_preferences;

  -- Iterate over all the profiles in the temporary table
  FOR p_to_check IN (SELECT aged_id_pretty
                     FROM c4a_i_schema.pcd_temporary)
  LOOP
    -- Check if a profile exists or not in the database
    IF NOT EXISTS (SELECT aged_id_pretty
                   FROM c4a_i_schema.profile_communicative_details
                   WHERE aged_id_pretty = p_to_check) THEN
      -- Insert into the profile_communicative table
      INSERT INTO c4a_i_schema.profile_communicative_details(aged_id, communication_style, message_frequency, topics, available_channels, aged_id_pretty)
        SELECT aged_id, communication_style, message_frequency, topics, available_channels, aged_id_pretty
        FROM c4a_i_schema.pcd_temporary AS pcd_insert
        WHERE pcd_insert.aged_id_pretty = p_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.profile_communicative_details AS pcd
      SET aged_id = pcd_update.aged_id,
        communication_style = pcd_update.communication_style,
        message_frequency = pcd_update.message_frequency,
        topics = pcd_update.topics,
        available_channels = pcd_update.available_channels,
        aged_id_pretty = pcd_update.aged_id_pretty
      FROM c4a_i_schema.pcd_temporary AS pcd_update
      WHERE pcd.aged_id_pretty = pcd_update.aged_id_pretty
            AND pcd_update.aged_id_pretty = p_to_check;
    END IF;
  END LOOP;

  FOR profile_p, hour_h IN (SELECT aged_id, hour_id
                            FROM c4a_i_schema.pcd_temporary)
  LOOP
    IF NOT EXISTS (SELECT aged_id, hour_period_id
                   FROM c4a_i_schema.profile_hour_preferences
                   WHERE aged_id = profile_p AND hour_period_id = hour_h) THEN
      -- Insert of the hour preferences in the profile_hour_preferences table
      INSERT INTO c4a_i_schema.profile_hour_preferences(aged_id, hour_period_id)
        SELECT aged_id, hour_id
        FROM c4a_i_schema.pcd_temporary
        WHERE aged_id = profile_p AND hour_id = hour_h;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.pcd_temporary;

  RAISE NOTICE 'Communicative details of the profiles successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_profile_communicative_details(file_path character varying) OWNER TO postgres;

--
-- Name: import_profile_frailty(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_profile_frailty(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate through the temporary profiles
DECLARE p_to_check character varying (50);

BEGIN

  -- Create temporary table to manage the import
  CREATE TABLE IF NOT EXISTS c4a_i_schema.pfs_temporary
  (
    aged_name character varying(50),
    frailty_status_overall c4a_i_schema.color_state,
    frailty_status_lastperiod c4a_i_schema.color_state,
    frailty_notice character varying(1000),
    frailty_textline character varying(150),
    frailty_attention c4a_i_schema.color_state,
    last_detection_date date,
    last_intervention_date date,
    detection_status c4a_i_schema.frailty_detint_status,
    intervention_status c4a_i_schema.frailty_detint_status,
    aged_id integer,
    frailty_status_text character varying(50),
    frailty_status_number character varying(10),
    aged_id_pretty character varying(50)
  );

  -- Execute COPY to import the csv file into the temporary table
  EXECUTE format($$COPY c4a_i_schema.pfs_temporary(aged_id_pretty, frailty_status_overall,
					frailty_status_lastperiod, frailty_notice, frailty_textline, frailty_attention,
					last_detection_date, last_intervention_date, detection_status, intervention_status,
					frailty_status_text, frailty_status_number)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Update the temporary table adding the aged_id
  UPDATE c4a_i_schema.pfs_temporary
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = pfs_temporary.aged_id_pretty;

  -- Update the temporary table adding the aged_name with a concatenation of name and surname from the profile table
  UPDATE c4a_i_schema.pfs_temporary
  SET aged_name = (SELECT concat_ws(' ', surname, name)
                   FROM c4a_i_schema.profile
                   WHERE aged_id_pretty = pfs_temporary.aged_id_pretty);

  -- Iterate over all the profiles in the temporary table
  FOR p_to_check IN (SELECT aged_id_pretty
                     FROM c4a_i_schema.pfs_temporary)
  LOOP
    -- Check if a profile exists or not in the database
    IF NOT EXISTS (SELECT aged_id_pretty
                   FROM c4a_i_schema.profile_frailty_status
                   WHERE aged_id_pretty = p_to_check) THEN
      -- Insert into the profile_frailty_status table
      INSERT INTO c4a_i_schema.profile_frailty_status(aged_name, aged_id, aged_id_pretty, frailty_status_overall,
                                                      frailty_status_lastperiod, frailty_notice, frailty_textline, frailty_attention,
                                                      last_detection_date, last_intervention_date, detection_status, intervention_status,
                                                      frailty_status_text, frailty_status_number)
        SELECT aged_name, aged_id, aged_id_pretty, frailty_status_overall, frailty_status_lastperiod, frailty_notice, frailty_textline,
          frailty_attention, last_detection_date, last_intervention_date, detection_status, intervention_status,
          frailty_status_text, frailty_status_number
        FROM c4a_i_schema.pfs_temporary AS pfs_insert
        WHERE pfs_insert.aged_id_pretty = p_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.profile_frailty_status AS pfs
      SET aged_name = pfs_update.aged_name,
        frailty_status_overall = pfs_update.frailty_status_overall,
        frailty_notice = pfs_update.frailty_notice,
        frailty_textline = pfs_update.frailty_textline,
        frailty_attention = pfs_update.frailty_attention,
        last_detection_date = pfs_update.last_detection_date,
        last_intervention_date = pfs_update.last_intervention_date,
        detection_status = pfs_update.detection_status,
        intervention_status = pfs_update.intervention_status,
        frailty_status_text = pfs_update.frailty_status_text,
        frailty_status_number = pfs_update.frailty_status_number,
        aged_id_pretty = pfs_update.aged_id_pretty,
        frailty_status_lastperiod = pfs_update.frailty_status_lastperiod
      FROM c4a_i_schema.pfs_temporary AS pfs_update
      WHERE pfs.aged_id_pretty = pfs_update.aged_id_pretty
            AND pfs_update.aged_id_pretty = p_to_check;

    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.pfs_temporary;

  RAISE NOTICE 'Frailty status of the profiles succesfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_profile_frailty(file_path character varying) OWNER TO postgres;

--
-- Name: import_profile_socioeconomic(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_profile_socioeconomic(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate through the temporary profiles
DECLARE p_to_check character varying (50);

BEGIN

  -- Create temporary table for the socioeconomic details
  CREATE TABLE IF NOT EXISTS c4a_i_schema.psd_temporary
  (
    aged_id integer,
    financial_situation character varying(25),
    married boolean,
    education_level character varying(25),
    languages character varying(50),
    personal_interests character varying(100),
    aged_id_pretty character varying(50)
  );

  -- Import of the file into the socioeconomic temporary table
  EXECUTE format($$COPY c4a_i_schema.psd_temporary(aged_id_pretty, financial_situation, married, education_level, languages, personal_interests)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Update the temporary table adding the aged_id
  UPDATE c4a_i_schema.psd_temporary
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = psd_temporary.aged_id_pretty;

  -- Iterate over all the profiles in the temporary table
  FOR p_to_check IN (SELECT aged_id_pretty
                     FROM c4a_i_schema.psd_temporary)
  LOOP
    -- Check if a profile exists or not in the database
    IF NOT EXISTS (SELECT aged_id_pretty
                   FROM c4a_i_schema.profile_socioeconomic_details
                   WHERE aged_id_pretty = p_to_check) THEN
      -- Insert into the profile socioeconomic table
      INSERT INTO c4a_i_schema.profile_socioeconomic_details(
        aged_id, financial_situation, married, education_level, languages,
        personal_interests, aged_id_pretty)
        SELECT aged_id, financial_situation, married, education_level, languages,
          personal_interests, aged_id_pretty
        FROM c4a_i_schema.psd_temporary AS psd_insert
        WHERE psd_insert.aged_id_pretty = p_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.profile_socioeconomic_details AS psd
      SET financial_situation = psd_update.financial_situation,
        married = psd_update.married,
        education_level = psd_update.education_level,
        languages = psd_update.languages,
        personal_interests = psd_update.personal_interests,
        aged_id_pretty = psd_update.aged_id_pretty
      FROM c4a_i_schema.psd_temporary AS psd_update
      WHERE psd_update.aged_id_pretty = psd.aged_id_pretty
            AND psd_update.aged_id_pretty = p_to_check;

    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.psd_temporary;

  RAISE NOTICE 'Socioeconomic profiles successfully imported';

END;
$_$;


ALTER FUNCTION c4a_i_schema.import_profile_socioeconomic(file_path character varying) OWNER TO postgres;

--
-- Name: import_profile_tech_details(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_profile_tech_details(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to iterate through the profiles
DECLARE profile_to_check character varying (50);

BEGIN

  -- Create temporary profile_tech details table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.ptd_temporary
  (
    aged_id integer,
    address character varying(75) DEFAULT NULL::character varying,
    telephone_home_number character varying(20) DEFAULT NULL::character varying,
    mobile_phone_number character varying(20) DEFAULT NULL::character varying,
    email character varying(75) DEFAULT NULL::character varying,
    facebook_account character varying(100) DEFAULT NULL::character varying,
    telegram_account character varying(100),
    aged_id_pretty character varying(50)
  );

  -- Import of the file into the temporary communicative details temporary table
  EXECUTE format($$COPY c4a_i_schema.ptd_temporary(aged_id_pretty, address, telephone_home_number, mobile_phone_number, email, facebook_account, telegram_account)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Updating the temporary table to include the aged_id taken from the profile table
  UPDATE c4a_i_schema.ptd_temporary
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = ptd_temporary.aged_id_pretty;

  -- Iterate over all the profiles in the temporary table
  FOR profile_to_check IN (SELECT aged_id_pretty
                           FROM c4a_i_schema.ptd_temporary)
  LOOP
    -- Check if a profile exists or not in the database
    IF NOT EXISTS (SELECT aged_id_pretty
                   FROM c4a_i_schema.profile_technical_details
                   WHERE aged_id_pretty = profile_to_check) THEN
      -- If not exists, then perform the insert
      INSERT INTO c4a_i_schema.profile_technical_details(aged_id, aged_id_pretty, address, telephone_home_number, mobile_phone_number, email, facebook_account, telegram_account)
        SELECT aged_id, aged_id_pretty, address, telephone_home_number, mobile_phone_number, email, facebook_account, telegram_account
        FROM c4a_i_schema.ptd_temporary AS ptd_insert
        WHERE ptd_insert.aged_id_pretty = profile_to_check;
    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.profile_technical_details AS ptd
      SET address = ptd_update.address,
        telephone_home_number = ptd_update.telephone_home_number,
        mobile_phone_number = ptd_update.mobile_phone_number,
        email = ptd_update.email,
        facebook_account = ptd_update.facebook_account,
        telegram_account = ptd_update.telegram_account,
        aged_id_pretty = ptd_update.aged_id_pretty
      FROM c4a_i_schema.ptd_temporary AS ptd_update
      WHERE ptd_update.aged_id_pretty = ptd.aged_id_pretty
            AND ptd_update.aged_id_pretty = profile_to_check;

    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.ptd_temporary;

  RAISE NOTICE 'Technical details of the profiles successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_profile_tech_details(file_path character varying) OWNER TO postgres;

--
-- Name: import_resources(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_resources(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to check if a subject is already inserted or not
DECLARE subj_temp character varying (25);
  -- Variable to check if a resource is already inserted or not
  DECLARE resource_to_check character varying (25);
  -- Variables to check the relationship between resource and subjects
  DECLARE resource_r character varying (25);
  DECLARE subject_s integer;

BEGIN

  -- Create subjects_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.subjects_temporary
  (
    subject_id integer NOT NULL DEFAULT nextval('c4a_i_schema.subjects_temporary_id_seq'::regclass),
    subject_name character varying(150) NOT NULL,
    subject_group character varying(25),
    CONSTRAINT pk_subjects_temporary PRIMARY KEY (subject_id)
  );

  -- Create temporary table for the relationship between resource and subjects
  CREATE TABLE IF NOT EXISTS c4a_i_schema.rhs_temporary
  (
    resource_id character varying(25) NOT NULL,
    subject_id integer,
    subject_name character varying(100) NOT NULL,
    CONSTRAINT pk_rhs_temporary PRIMARY KEY (resource_id, subject_name)
  );

  -- Create resource_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.resource_temporary
  (
    oid integer NOT NULL DEFAULT nextval('c4a_i_schema.resource_oid_seq'::regclass),
    resource_id character varying(25) NOT NULL,
    resource_name character varying(200) NOT NULL,
    category character varying(25) NOT NULL,
    description character varying(1200) NOT NULL,
    media character varying(200),
    url character varying(200),
    language character varying(25),
    authoritativeness character varying(25),
    from_date date,
    to_date date,
    addressed_to character varying(50),
    partner character varying(50),
    translated boolean,
    has_messages boolean,
    periodic boolean,
    repeating_time character varying(25),
    repeating_every integer,
    repeating_on_day character varying(60),
    subjects character varying(200),
    CONSTRAINT pk_resource_temporary PRIMARY KEY (resource_id)
  );

  -- Compute the Import of the file into resource_temporary
  EXECUTE format($$COPY c4a_i_schema.resource_temporary (resource_id, partner, language, category,
resource_name, subjects,url, description, from_date, to_date, media, has_messages, translated, periodic,
repeating_time, repeating_every, repeating_on_day)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Insert of temporary subject from the resource_temporary table
  INSERT INTO c4a_i_schema.subjects_temporary(subject_name)
    SELECT a
    FROM c4a_i_schema.resource_temporary AS rt, regexp_split_to_table(rt.subjects, ', ') AS a;

  -- Import of distinct and not already inserted subject_name into the table subject
  FOR subj_temp IN (SELECT subject_name
                    FROM c4a_i_schema.subjects_temporary)
  LOOP
    IF NOT EXISTS (SELECT subject_name FROM c4a_i_schema.subject WHERE subject_name = subj_temp)
    THEN
      INSERT INTO c4a_i_schema.subject(subject_name) VALUES (subj_temp);
    END IF;
  END LOOP;

  -- Insert of the relationships between resources and subjects
  INSERT INTO c4a_i_schema.rhs_temporary(resource_id, subject_name)
    SELECT rt.resource_id, a
    FROM c4a_i_schema.resource_temporary AS rt, regexp_split_to_table(rt.subjects, ', ') AS a;

  -- Updating the relationships to include the subject_id taken from the subejct table
  UPDATE c4a_i_schema.rhs_temporary AS rhs
  SET subject_id = s.subject_id
  FROM c4a_i_schema.subject AS s
  WHERE s.subject_name = rhs.subject_name;

  -- Iterate over all the resources in the temporary table
  FOR resource_to_check IN (SELECT resource_id
                            FROM c4a_i_schema.resource_temporary)
  LOOP
    -- Check if a resource exists or not in the database
    IF NOT EXISTS (SELECT resource_id
                   FROM c4a_i_schema.resource
                   WHERE resource_id = resource_to_check) THEN
      -- If not exists, then perform the insert
      INSERT INTO c4a_i_schema.resource(resource_id, partner, language, category, resource_name, url, description,
                                        from_date, to_date, media, has_messages, translated, periodic, repeating_time,
                                        repeating_every, repeating_on_day)
        SELECT resource_id, partner, language, category, resource_name, url, description,
          from_date, to_date, media, has_messages, translated, periodic, repeating_time, repeating_every,
          repeating_on_day
        FROM c4a_i_schema.resource_temporary AS rt_insert
        WHERE rt_insert.resource_id = resource_to_check;

    ELSE
      -- It already exists in the database, so it is updated
      UPDATE c4a_i_schema.resource AS rup
      SET resource_id = rtupdate.resource_id,
        partner = rtupdate.partner,
        language = rtupdate.language,
        category = rtupdate.category,
        resource_name = rtupdate.resource_name,
        url = rtupdate.url,
        description = rtupdate.description,
        from_date = rtupdate.from_date,
        to_date = rtupdate.to_date,
        media = rtupdate.media,
        has_messages = rtupdate.has_messages,
        translated = rtupdate.translated,
        periodic = rtupdate.periodic,
        repeating_time = rtupdate.repeating_time,
        repeating_every = rtupdate.repeating_every,
        repeating_on_day = rtupdate.repeating_on_day
      FROM c4a_i_schema.resource_temporary AS rtupdate
      WHERE rup.resource_id = rtupdate.resource_id AND rtupdate.resource_id = resource_to_check;

    END IF;
  END LOOP;

  -- Check if the relationship between resources and subjects already exist in the database
  FOR resource_r, subject_s IN (SELECT resource_id, subject_id FROM c4a_i_schema.rhs_temporary)
  LOOP
    IF NOT EXISTS (SELECT resource_id, subject_id
                   FROM c4a_i_schema.resource_has_subjects
                   WHERE resource_id = resource_r AND subject_id = subject_s) THEN
      -- Insert of the relationships into resource_has_subjects if it not exists
      INSERT INTO c4a_i_schema.resource_has_subjects(resource_id, subject_id)
        SELECT resource_id, subject_id
        FROM c4a_i_schema.rhs_temporary
        WHERE resource_id = resource_r AND subject_id = subject_s;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.subjects_temporary;
  DROP TABLE c4a_i_schema.rhs_temporary;
  DROP TABLE c4a_i_schema.resource_temporary;

  RAISE NOTICE 'Resources succesfully updated';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_resources(file_path character varying) OWNER TO postgres;

--
-- Name: import_socioeconomic(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_socioeconomic(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  CREATE TABLE IF NOT EXISTS c4a_i_schema.pse_temporary
  (
    aged_id integer,
    financial_situation character varying(25),
    married boolean,
    education_level character varying(25),
    languages character varying(50),
    personal_interests character varying(600),
    aged_id_pretty character varying(50),
    CONSTRAINT pk_profilesocioeconomic_temporary PRIMARY KEY (aged_id_pretty)
  );


  -- Import of the file into the profile_socioeconomic_details table
  EXECUTE format($$COPY c4a_i_schema.pse_temporary(aged_id_pretty, financial_situation, married, education_level, languages, personal_interests)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Updating the temporary table to include the aged_id taken from the profile table
  UPDATE c4a_i_schema.pse_temporary
  SET aged_id = p.aged_id
  FROM c4a_i_schema.profile AS p
  WHERE p.aged_id_pretty = pse_temporary.aged_id_pretty;

  -- Insert of the communicative details of a profile into the table taking the values from the temporary one
  INSERT INTO c4a_i_schema.profile_socioeconomic_details(aged_id, financial_situation, married, education_level, languages, personal_interests, aged_id_pretty)
    SELECT aged_id, financial_situation, married, education_level, languages, personal_interests, aged_id_pretty
    FROM c4a_i_schema.pcd_temporary;

  -- Drop the temporary table used to import the data
  DROP TABLE c4a_i_schema.pse_temporary;


  RAISE NOTICE 'Channels successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_socioeconomic(file_path character varying) OWNER TO postgres;

--
-- Name: import_templates(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_templates(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$-- Variable to check the template
DECLARE template_to_check character varying (25);
  -- Variables to check the relationship between resource and subjects
  DECLARE template_t character varying (25);
  DECLARE channel_c integer;

BEGIN

  -- Creation template_temporary table
  CREATE TABLE IF NOT EXISTS c4a_i_schema.template_temporary
  (
    template_id character varying(25),
    title character varying(150),
    description character varying(1500),
    flowchart json,
    period integer,
    min_number_messages integer,
    max_number_messages integer,
    compulsory character varying(75),
    addressed_to character varying(75),
    category character varying(50),
    channels character varying (100),
    CONSTRAINT pk_template_temporary PRIMARY KEY (template_id)
  );

  -- Create the temporary table for the relationship template_has_channels
  CREATE TABLE IF NOT EXISTS c4a_i_schema.thc_temporary
  (
    channel_id integer,
    template_id character varying(25),
    channel_name character varying (25)
  );

  -- Import of the file into template_temporary
  EXECUTE format($$COPY c4a_i_schema.template_temporary (template_id, category, title, description, min_number_messages, max_number_messages, period, channels)
FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  -- Insert of the relationships between template and channel in the temporary table.
  -- The function regexp_split_to_table takes the list of channels store into channels and split it into several instances
  INSERT INTO c4a_i_schema.thc_temporary(template_id, channel_name)
    SELECT tt.template_id, c
    FROM c4a_i_schema.template_temporary AS tt, regexp_split_to_table(tt.channels, ', ') AS c;

  -- Updating the relationships to include the channel_id taken from the channel table
  UPDATE c4a_i_schema.thc_temporary AS thc
  SET channel_id = c.channel_id
  FROM c4a_i_schema.channel AS c
  WHERE c.channel_name = thc.channel_name;

  -- Iterate over all the templates in the temporary table
  FOR template_to_check IN (SELECT template_id
                            FROM c4a_i_schema.template_temporary)
  LOOP
    -- If a template does not exists it is inserted, otherwise, the corresponding template is updated
    IF NOT EXISTS (SELECT template_id FROM c4a_i_schema.template WHERE template_id = template_to_check) THEN
      -- Insert the template that there is not in the template table
      INSERT INTO c4a_i_schema.template(template_id, category, title, description, min_number_messages, max_number_messages, period)
        SELECT  template_id, category, title, description, min_number_messages, max_number_messages, period
        FROM c4a_i_schema.template_temporary AS tt_insert
        WHERE tt_insert.template_id = template_to_check;
    ELSE
      -- Update the template that is already present in the template table
      UPDATE c4a_i_schema.template AS tup
      SET template_id = ttupdate.template_id,
        category = ttupdate.category,
        title = ttupdate.title,
        description = ttupdate.description,
        min_number_messages = ttupdate.min_number_messages,
        max_number_messages = ttupdate.max_number_messages,
        period = ttupdate.period
      FROM c4a_i_schema.template_temporary AS ttupdate
      WHERE tup.template_id = ttupdate.template_id
            AND ttupdate.template_id = template_to_check;
    END IF;
  END LOOP;

  -- Check if the relationship between template and channels already exist in the database
  FOR template_t, channel_c IN (SELECT template_id, channel_id
                                FROM c4a_i_schema.thc_temporary)
  LOOP
    IF NOT EXISTS (SELECT template_id, channel_id
                   FROM c4a_i_schema.template_has_channel
                   WHERE template_id = template_t AND channel_id = channel_c) THEN
      -- Insert of the relationship (only ids) from the temporary table
      INSERT INTO c4a_i_schema.template_has_channel(template_id, channel_id)
        SELECT template_id, channel_id
        FROM c4a_i_schema.thc_temporary
        WHERE template_id = template_t AND channel_id = channel_c;
    END IF;
  END LOOP;

  DROP TABLE c4a_i_schema.thc_temporary;
  DROP TABLE c4a_i_schema.template_temporary;

  RAISE NOTICE 'Templates correctly inserted';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_templates(file_path character varying) OWNER TO postgres;

--
-- Name: import_users(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION import_users(file_path character varying) RETURNS void
LANGUAGE plpgsql
AS $_$BEGIN

  -- Import of the file into user

  EXECUTE format($$COPY c4a_i_schema.user(name, surname, password, role, permission_type, email, mobilephone_number, user_id_pretty)

FROM %L WITH DELIMITER ';' CSV HEADER$$, $1);

  RAISE NOTICE 'users successfully imported';

END;$_$;


ALTER FUNCTION c4a_i_schema.import_users(file_path character varying) OWNER TO postgres;

--
-- Name: insert_into_predeliverymessages(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION insert_into_predeliverymessages() RETURNS trigger
LANGUAGE plpgsql
AS $$DECLARE pdm_id integer;

BEGIN

  INSERT INTO c4a_i_schema.predelivery_messages (miniplan_id, miniplan_message_id, channel, time_prescription, message_text, message_image, message_url, message_video, message_audio, message_id, pilot_id)

    SELECT mfm.miniplan_id, mfm.miniplan_message_id, mfm.channel, mfm.time_prescription, mfm.text, mfm.media, mfm.url, mfm.video, mfm.audio, mfm.message_id, pd.pilot_id

    FROM c4a_i_schema.miniplan_final_messages AS mfm, c4a_i_schema.pilot_details AS pd

    WHERE mfm.miniplan_message_id = NEW.miniplan_message_id

  RETURNING predelivery_message_id INTO pdm_id;

  UPDATE c4a_i_schema.predelivery_messages AS pdm

  SET aged_id = iss.aged_id

  FROM c4a_i_schema.intervention_session AS iss,

    c4a_i_schema.miniplan_final AS mf

  WHERE pdm.predelivery_message_id = pdm_id

        AND pdm.miniplan_id = mf.miniplan_final_id

        AND mf.intervention_session_id = iss.intervention_session_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.insert_into_predeliverymessages() OWNER TO postgres;

--
-- Name: temp_miniplan_from_generated(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION temp_miniplan_from_generated() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN

  INSERT INTO c4a_i_schema.miniplan_temporary(miniplan_generated_id,

                                              intervention_session_id, save_date, miniplan_body, temporary_resource_id,

                                              temporary_template_id, from_date, to_date, is_committed, aged_id)

    SELECT mg.miniplan_generated_id, mg.intervention_session_id, mg.generation_date,

      mg.generated_miniplan_body, mg.generated_resource_id, mg.generated_template_id,

      mg.from_date, mg.to_date, mg.is_committed, mg.aged_id

    FROM c4a_i_schema.miniplan_generated AS mg

    WHERE mg.miniplan_generated_id = NEW.miniplan_generated_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.temp_miniplan_from_generated() OWNER TO postgres;

--
-- Name: temp_mp_messages_from_generated(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION temp_mp_messages_from_generated() RETURNS trigger
LANGUAGE plpgsql
AS $$DECLARE tm_id integer;

BEGIN

  INSERT INTO c4a_i_schema.miniplan_temporary_messages(miniplan_temporary_id, intervention_session_id)

    SELECT mt.miniplan_temporary_id, mt.intervention_session_id

    FROM c4a_i_schema.miniplan_generated_messages AS mgm, c4a_i_schema.miniplan_temporary AS mt

    WHERE mt.miniplan_generated_id = NEW.miniplan_generated_id

          AND mgm.miniplan_generated_id = NEW.miniplan_generated_id

    LIMIT 1

  RETURNING temporary_message_id INTO tm_id;

  UPDATE c4a_i_schema.miniplan_temporary_messages AS mtm

  SET channel = NEW.channel,

    time_prescription = NEW.time_prescription,

    message_id = NEW.message_id,

    text = NEW.text,

    media = NEW.media,

    url = NEW.url,

    video = NEW.video,

    audio = NEW.audio,

    range_hour_start = NEW.range_hour_start,

    range_hour_end = NEW.range_hour_end,

    range_day_start = NEW.range_day_start,

    range_day_end = NEW.range_day_end,

    status = NEW.status,

    message_body = NEW.message_body

  FROM c4a_i_schema.miniplan_generated_messages AS mgm

  WHERE mgm.generated_message_id = NEW.generated_message_id

        AND mtm.temporary_message_id = tm_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.temp_mp_messages_from_generated() OWNER TO postgres;

--
-- Name: update_gen_temp_miniplan_final_id(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION update_gen_temp_miniplan_final_id() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN

  UPDATE c4a_i_schema.miniplan_generated

  SET miniplan_final_id = NEW.miniplan_final_id

  WHERE miniplan_generated_id = NEW.miniplan_generated_id;

  UPDATE c4a_i_schema.miniplan_temporary

  SET final_miniplan_id = NEW.miniplan_final_id

  WHERE miniplan_generated_id = NEW.miniplan_generated_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.update_gen_temp_miniplan_final_id() OWNER TO postgres;

--
-- Name: update_predelivery_status(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION update_predelivery_status() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN

  UPDATE c4a_i_schema.predelivery_messages

  SET status = 'to sent - updated', time_prescription = NEW.time_prescription

  WHERE miniplan_message_id = NEW.miniplan_message_id

        AND miniplan_id = NEW.miniplan_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.update_predelivery_status() OWNER TO postgres;

--
-- Name: update_status_after_postdelivery(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION update_status_after_postdelivery() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN

  IF (NEW.error_string IS NOT NULL) THEN

    UPDATE c4a_i_schema.predelivery_messages

    SET status = 'error - not sent'

    WHERE pilot_id = NEW.pilot_id

          AND miniplan_message_id = NEW.miniplan_message_id;

  ELSIF (NEW.sent = TRUE) THEN

    UPDATE c4a_i_schema.predelivery_messages

    SET status = 'succesfully sent'

    WHERE pilot_id = NEW.pilot_id

          AND miniplan_message_id = NEW.miniplan_message_id;

  END IF;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.update_status_after_postdelivery() OWNER TO postgres;

--
-- Name: update_temporarymp_commit(); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

CREATE FUNCTION update_temporarymp_commit() RETURNS trigger
LANGUAGE plpgsql
AS $$BEGIN

  UPDATE c4a_i_schema.miniplan_temporary

  SET is_committed = FALSE

  WHERE miniplan_generated_id = NEW.miniplan_generated_id;

  UPDATE c4a_i_schema.miniplan_generated

  SET is_committed = FALSE

  WHERE miniplan_generated_id = NEW.miniplan_generated_id;

  RETURN NEW;

END;$$;


ALTER FUNCTION c4a_i_schema.update_temporarymp_commit() OWNER TO postgres;

--
-- Name: channel_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE channel_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.channel_oid_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: channel; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE channel (
  channel_id integer NOT NULL,
  channel_name character varying(25) NOT NULL,
  oid integer DEFAULT nextval('channel_oid_seq'::regclass)
);


ALTER TABLE c4a_i_schema.channel OWNER TO postgres;

--
-- Name: hour_period; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE hour_period (
  hour_period_id integer NOT NULL,
  hour_period_name character varying(15),
  hour_period_start time without time zone,
  hour_period_end time without time zone
);


ALTER TABLE c4a_i_schema.hour_period OWNER TO postgres;

--
-- Name: hour_division_hour_division_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE hour_division_hour_division_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.hour_division_hour_division_id_seq OWNER TO postgres;

--
-- Name: hour_division_hour_division_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE hour_division_hour_division_id_seq OWNED BY hour_period.hour_period_id;


--
-- Name: intervention_session; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE intervention_session (
  intervention_session_id integer NOT NULL,
  title character varying(50) NOT NULL,
  prescription_id integer,
  confirmed_caregiver_id integer,
  aged_id integer,
  intervention_status intervention_status,
  from_date date,
  to_date date
);


ALTER TABLE c4a_i_schema.intervention_session OWNER TO postgres;

--
-- Name: COLUMN intervention_session.intervention_session_id; Type: COMMENT; Schema: c4a_i_schema; Owner: postgres
--

COMMENT ON COLUMN intervention_session.intervention_session_id IS '

';


--
-- Name: intervention_session_intervention_session_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE intervention_session_intervention_session_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.intervention_session_intervention_session_id_seq OWNER TO postgres;

--
-- Name: intervention_session_intervention_session_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE intervention_session_intervention_session_id_seq OWNED BY intervention_session.intervention_session_id;


--
-- Name: intervention_session_temporary; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE intervention_session_temporary (
  intervention_temporary_id integer NOT NULL,
  temporary_resources json,
  temporary_template json,
  temporary_dates json
);


ALTER TABLE c4a_i_schema.intervention_session_temporary OWNER TO postgres;

--
-- Name: intervention_temporary_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE intervention_temporary_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.intervention_temporary_id_seq OWNER TO postgres;

--
-- Name: manager_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE manager_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.manager_oid_seq OWNER TO postgres;

--
-- Name: manager; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE manager (
  manager_id integer DEFAULT nextval('manager_oid_seq'::regclass) NOT NULL,
  name character varying(25),
  surname character varying(25),
  email character varying(50),
  telephone_contact character varying(25),
  birth_date date
);


ALTER TABLE c4a_i_schema.manager OWNER TO postgres;

--
-- Name: message; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE message (
  oid integer NOT NULL,
  message_id character varying(25) NOT NULL,
  text character varying(2000) NOT NULL,
  media character varying(200),
  url character varying(200),
  video character varying(200),
  audio character varying(200),
  semantic_type character varying(50),
  communication_style character varying(50),
  is_compulsory boolean
);


ALTER TABLE c4a_i_schema.message OWNER TO postgres;

--
-- Name: message_has_channel; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE message_has_channel (
  message_id character varying(25) NOT NULL,
  channel_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.message_has_channel OWNER TO postgres;

--
-- Name: message_has_payoff; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE message_has_payoff (
  message_id character varying(25) NOT NULL,
  payoff_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.message_has_payoff OWNER TO postgres;

--
-- Name: message_has_subject; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE message_has_subject (
  message_id character varying(25) NOT NULL,
  subject_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.message_has_subject OWNER TO postgres;

--
-- Name: message_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE message_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.message_oid_seq OWNER TO postgres;

--
-- Name: message_oid_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE message_oid_seq OWNED BY message.oid;


--
-- Name: message_temporary; Type: TABLE; Schema: c4a_i_schema; Owner: c4aapidb; Tablespace:
--

CREATE TABLE message_temporary (
  resource_id character varying(25),
  resource_name character varying(200),
  category character varying(25),
  description character varying(1200),
  message_id character varying(25) NOT NULL,
  text character varying(1200) NOT NULL,
  media character varying(200),
  url character varying(200),
  video character varying(200),
  audio character varying(200),
  semantic_type character varying(50),
  communication_style character varying(50),
  is_compulsory boolean,
  channels character varying(50)
);


ALTER TABLE c4a_i_schema.message_temporary OWNER TO c4aapidb;

--
-- Name: mhc_temporary; Type: TABLE; Schema: c4a_i_schema; Owner: c4aapidb; Tablespace:
--

CREATE TABLE mhc_temporary (
  message_id character varying(25),
  channel_id integer,
  channel_name character varying(25)
);


ALTER TABLE c4a_i_schema.mhc_temporary OWNER TO c4aapidb;

--
-- Name: miniplan_final; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_final (
  intervention_session_id integer,
  miniplan_generated_id integer,
  commit_caregiver_id integer,
  commit_date timestamp with time zone,
  miniplan_body json,
  from_date date,
  to_date date,
  miniplan_final_id integer NOT NULL,
  final_template_id character varying(25),
  final_resource_id character varying(25)
);


ALTER TABLE c4a_i_schema.miniplan_final OWNER TO postgres;

--
-- Name: miniplan_final_messages_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_final_messages_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_final_messages_id_seq OWNER TO postgres;

--
-- Name: miniplan_final_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_final_messages (
  miniplan_message_id integer DEFAULT nextval('miniplan_final_messages_id_seq'::regclass) NOT NULL,
  miniplan_id integer NOT NULL,
  intervention_session_id integer,
  channel character varying(45),
  time_prescription timestamp with time zone,
  message_body json,
  is_modified boolean DEFAULT false,
  message_id character varying(25),
  text character varying(1200),
  media character varying(200),
  url character varying(200),
  video character varying(200),
  audio character varying(200),
  status messages_status DEFAULT 'to send'::messages_status
);


ALTER TABLE c4a_i_schema.miniplan_final_messages OWNER TO postgres;

--
-- Name: miniplan_final_miniplan_final_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_final_miniplan_final_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_final_miniplan_final_id_seq OWNER TO postgres;

--
-- Name: miniplan_final_miniplan_final_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE miniplan_final_miniplan_final_id_seq OWNED BY miniplan_final.miniplan_final_id;


--
-- Name: miniplan_generated; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_generated (
  miniplan_generated_id integer NOT NULL,
  miniplan_final_id integer,
  generation_date timestamp without time zone,
  from_date date,
  to_date date,
  generated_miniplan_body json,
  intervention_session_id integer,
  generated_resource_id character varying(25),
  generated_template_id character varying(25),
  is_committed boolean,
  aged_id integer
);


ALTER TABLE c4a_i_schema.miniplan_generated OWNER TO postgres;

--
-- Name: miniplan_generated_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_generated_messages (
  generated_message_id integer NOT NULL,
  miniplan_generated_id integer NOT NULL,
  intervention_session_id integer,
  channel character varying(45),
  time_prescription timestamp with time zone,
  message_body json,
  range_day_start date,
  range_day_end date,
  range_hour_start time without time zone,
  range_hour_end time without time zone,
  text character varying(1200),
  media character varying(200),
  url character varying(200),
  video character varying(200),
  audio character varying(200),
  message_id character varying(25),
  status messages_status DEFAULT 'to send'::messages_status
);


ALTER TABLE c4a_i_schema.miniplan_generated_messages OWNER TO postgres;

--
-- Name: miniplan_generated_messages_message_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_generated_messages_message_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_generated_messages_message_id_seq OWNER TO postgres;

--
-- Name: miniplan_generated_messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE miniplan_generated_messages_message_id_seq OWNED BY miniplan_generated_messages.generated_message_id;


--
-- Name: miniplan_generated_miniplan_generated_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_generated_miniplan_generated_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_generated_miniplan_generated_id_seq OWNER TO postgres;

--
-- Name: miniplan_generated_miniplan_generated_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE miniplan_generated_miniplan_generated_id_seq OWNED BY miniplan_generated.miniplan_generated_id;


--
-- Name: miniplan_temporary_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_temporary_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_temporary_id_seq OWNER TO postgres;

--
-- Name: miniplan_temporary; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_temporary (
  miniplan_temporary_id integer DEFAULT nextval('miniplan_temporary_id_seq'::regclass) NOT NULL,
  intervention_session_id integer,
  final_miniplan_id integer,
  save_caregiver_id integer,
  save_date timestamp without time zone DEFAULT now(),
  miniplan_body json,
  miniplan_generated_id integer,
  temporary_resource_id character varying(25),
  temporary_template_id character varying(25),
  from_date date,
  to_date date,
  is_committed boolean,
  aged_id integer
);


ALTER TABLE c4a_i_schema.miniplan_temporary OWNER TO postgres;

--
-- Name: miniplan_temporary_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_temporary_messages (
  temporary_message_id integer NOT NULL,
  miniplan_temporary_id integer NOT NULL,
  intervention_session_id integer,
  channel character varying(45),
  time_prescription timestamp with time zone,
  message_id character varying(25),
  text character varying(1200),
  media character varying(200),
  url character varying(200),
  video character varying(200),
  audio character varying(200),
  range_hour_start time without time zone,
  range_hour_end time without time zone,
  range_day_start date,
  range_day_end date,
  message_body json,
  status messages_status DEFAULT 'to send'::messages_status
);


ALTER TABLE c4a_i_schema.miniplan_temporary_messages OWNER TO postgres;

--
-- Name: miniplan_temporary_messages_message_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE miniplan_temporary_messages_message_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.miniplan_temporary_messages_message_id_seq OWNER TO postgres;

--
-- Name: miniplan_temporary_messages_message_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE miniplan_temporary_messages_message_id_seq OWNED BY miniplan_temporary_messages.temporary_message_id;


--
-- Name: miniplan_used_behaviourmessages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_used_behaviourmessages (
  miniplan_id integer NOT NULL,
  beahaviour_message_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplan_used_behaviourmessages OWNER TO postgres;

--
-- Name: miniplan_used_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplan_used_messages (
  miniplan_id integer NOT NULL,
  message_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplan_used_messages OWNER TO postgres;

--
-- Name: miniplangenerated_used_behaviourmessages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplangenerated_used_behaviourmessages (
  miniplan_generate_id integer NOT NULL,
  behaviour_message_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplangenerated_used_behaviourmessages OWNER TO postgres;

--
-- Name: miniplangenerated_used_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplangenerated_used_messages (
  miniplan_generated_id integer NOT NULL,
  messages_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplangenerated_used_messages OWNER TO postgres;

--
-- Name: miniplantemporary_used_behaviourmessages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplantemporary_used_behaviourmessages (
  miniplan_temporary_id integer NOT NULL,
  behaviour_message_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplantemporary_used_behaviourmessages OWNER TO postgres;

--
-- Name: miniplantemporary_used_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE miniplantemporary_used_messages (
  miniplan_temporary_id integer NOT NULL,
  message_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.miniplantemporary_used_messages OWNER TO postgres;

--
-- Name: payoff; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE payoff (
  oid integer NOT NULL,
  payoff_id integer NOT NULL,
  payoff_name character varying(50),
  resource_id character varying(25) NOT NULL,
  text character varying(1200),
  image character varying(200),
  video character varying(200),
  audio character varying(200),
  url character varying(200)
);


ALTER TABLE c4a_i_schema.payoff OWNER TO postgres;

--
-- Name: payoff_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE payoff_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.payoff_oid_seq OWNER TO postgres;

--
-- Name: payoff_oid_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE payoff_oid_seq OWNED BY payoff.oid;


--
-- Name: permission; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE permission (
  permission_id integer NOT NULL,
  permission_type character varying(25),
  permisson_user_type character varying(25)
);


ALTER TABLE c4a_i_schema.permission OWNER TO postgres;

--
-- Name: permission_permission_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE permission_permission_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.permission_permission_id_seq OWNER TO postgres;

--
-- Name: permission_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE permission_permission_id_seq OWNED BY permission.permission_id;


--
-- Name: pilot_details; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE pilot_details (
  pilot_id character varying(25) NOT NULL,
  pilot_city character varying(25),
  pilot_nation character varying(25),
  pilot_telephone_contact character varying(25),
  pilot_email_contact character varying(50),
  pilot_manager character varying(50),
  pilot_registration_date date
);


ALTER TABLE c4a_i_schema.pilot_details OWNER TO postgres;

--
-- Name: postdelivery_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE postdelivery_messages (
  miniplan_message_id integer NOT NULL,
  message_id character varying(25),
  sent_date timestamp with time zone,
  sent boolean,
  error_string character varying(200),
  predelivery_message_id integer NOT NULL,
  postdelivery_id integer NOT NULL,
  pilot_id character varying(25) NOT NULL
);


ALTER TABLE c4a_i_schema.postdelivery_messages OWNER TO postgres;

--
-- Name: postdelivery_messages_postdelivery_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE postdelivery_messages_postdelivery_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.postdelivery_messages_postdelivery_id_seq OWNER TO postgres;

--
-- Name: postdelivery_messages_postdelivery_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE postdelivery_messages_postdelivery_id_seq OWNED BY postdelivery_messages.postdelivery_id;


--
-- Name: predelivery_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE predelivery_messages (
  miniplan_message_id integer NOT NULL,
  aged_id integer,
  channel character varying(45),
  time_prescription timestamp with time zone,
  message_text character varying(1200),
  message_image character varying(200),
  message_url character varying(200),
  message_video character varying(200),
  message_audio character varying(200),
  message_id character varying(25),
  miniplan_id integer,
  predelivery_message_id integer NOT NULL,
  pilot_id character varying(25) NOT NULL,
  status messages_status DEFAULT 'to send'::messages_status
);


ALTER TABLE c4a_i_schema.predelivery_messages OWNER TO postgres;

--
-- Name: predelivery_messages_predelivery_message_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE predelivery_messages_predelivery_message_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.predelivery_messages_predelivery_message_id_seq OWNER TO postgres;

--
-- Name: predelivery_messages_predelivery_message_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE predelivery_messages_predelivery_message_id_seq OWNED BY predelivery_messages.predelivery_message_id;


--
-- Name: prescription; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE prescription (
  aged_id integer,
  geriatrician_id integer,
  text character varying(2500),
  additional_notes character varying(500),
  valid_from date,
  valid_to date,
  urgency color_state,
  prescription_id integer NOT NULL,
  title character varying(45),
  prescription_status intervention_status,
  prescription_id_pretty character varying(50)
);


ALTER TABLE c4a_i_schema.prescription OWNER TO postgres;

--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE prescription_prescription_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.prescription_prescription_id_seq OWNER TO postgres;

--
-- Name: prescription_prescription_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE prescription_prescription_id_seq OWNED BY prescription.prescription_id;


--
-- Name: profile; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile (
  name character varying(50) NOT NULL,
  surname character varying(45) NOT NULL,
  date_of_birth date NOT NULL,
  profile_type character varying(50),
  sex character varying(10),
  aged_id integer NOT NULL,
  aged_id_pretty character varying(50),
  age integer
);


ALTER TABLE c4a_i_schema.profile OWNER TO postgres;

--
-- Name: profile_aged_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE profile_aged_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.profile_aged_id_seq OWNER TO postgres;

--
-- Name: profile_aged_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE profile_aged_id_seq OWNED BY profile.aged_id;


--
-- Name: profile_behaviour_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_behaviour_messages (
  message_id integer NOT NULL,
  aged_id integer NOT NULL,
  period_start date,
  period_end date,
  validity_period_start date,
  validity_period_end date,
  category character varying(50),
  text character varying(1000)
);


ALTER TABLE c4a_i_schema.profile_behaviour_messages OWNER TO postgres;

--
-- Name: profile_communicative_details; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_communicative_details (
  aged_id integer NOT NULL,
  communication_style character varying(25),
  message_frequency character varying(15),
  topics character varying(125),
  available_channels character varying(45),
  aged_id_pretty character varying(50)
);


ALTER TABLE c4a_i_schema.profile_communicative_details OWNER TO postgres;

--
-- Name: profile_frailty_status; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_frailty_status (
  aged_name character varying(50),
  frailty_status_overall color_state,
  frailty_notice character varying(1000),
  frailty_textline character varying(150),
  frailty_attention color_state,
  last_detection_date date,
  last_intervention_date date,
  detection_status frailty_detint_status,
  intervention_status frailty_detint_status,
  aged_id integer NOT NULL,
  frailty_status_text character varying(50),
  frailty_status_number character varying(10),
  aged_id_pretty character varying(50),
  frailty_status_lastperiod color_state
);


ALTER TABLE c4a_i_schema.profile_frailty_status OWNER TO postgres;

--
-- Name: profile_hour_preferences; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_hour_preferences (
  aged_id integer NOT NULL,
  hour_period_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.profile_hour_preferences OWNER TO postgres;

--
-- Name: profile_socioeconomic_details; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_socioeconomic_details (
  aged_id integer NOT NULL,
  financial_situation character varying(25),
  married boolean,
  education_level character varying(25),
  languages character varying(50),
  personal_interests character varying(600),
  aged_id_pretty character varying(25)
);


ALTER TABLE c4a_i_schema.profile_socioeconomic_details OWNER TO postgres;

--
-- Name: profile_technical_details; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE profile_technical_details (
  aged_id integer NOT NULL,
  address character varying(75) DEFAULT NULL::character varying,
  telephone_home_number character varying(20) DEFAULT NULL::character varying,
  mobile_phone_number character varying(20) DEFAULT NULL::character varying,
  email character varying(75) DEFAULT NULL::character varying,
  facebook_account character varying(100) DEFAULT NULL::character varying,
  telegram_account character varying(100),
  aged_id_pretty character varying(50)
);


ALTER TABLE c4a_i_schema.profile_technical_details OWNER TO postgres;

--
-- Name: resource; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE resource (
  oid integer NOT NULL,
  resource_id character varying(25) NOT NULL,
  resource_name character varying(200) NOT NULL,
  category character varying(25) NOT NULL,
  description character varying(1200) NOT NULL,
  media character varying(200),
  url character varying(200),
  language character varying(25),
  authoritativeness character varying(25),
  from_date date,
  to_date date,
  addressed_to character varying(50),
  partner character varying(50),
  translated boolean,
  has_messages boolean,
  periodic boolean,
  repeating_time character varying(25),
  repeating_every integer,
  repeating_on_day character varying(50)
);


ALTER TABLE c4a_i_schema.resource OWNER TO postgres;

--
-- Name: resource_has_messages; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE resource_has_messages (
  resource_id character varying(25) NOT NULL,
  message_id character varying(25) NOT NULL
);


ALTER TABLE c4a_i_schema.resource_has_messages OWNER TO postgres;

--
-- Name: resource_has_subjects; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE resource_has_subjects (
  resource_id character varying(25) NOT NULL,
  subject_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.resource_has_subjects OWNER TO postgres;

--
-- Name: resource_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE resource_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.resource_oid_seq OWNER TO postgres;

--
-- Name: resource_oid_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE resource_oid_seq OWNED BY resource.oid;


--
-- Name: subject; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE subject (
  subject_id integer NOT NULL,
  subject_name character varying(75) NOT NULL,
  subject_group character varying(25)
);


ALTER TABLE c4a_i_schema.subject OWNER TO postgres;

--
-- Name: subjects_subject_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE subjects_subject_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.subjects_subject_id_seq OWNER TO postgres;

--
-- Name: subjects_subject_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE subjects_subject_id_seq OWNED BY subject.subject_id;


--
-- Name: subjects_temporary_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE subjects_temporary_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.subjects_temporary_id_seq OWNER TO postgres;

--
-- Name: template; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE template (
  oid integer NOT NULL,
  template_id character varying(25) NOT NULL,
  title character varying(125) NOT NULL,
  description character varying(1500),
  flowchart json,
  period integer,
  min_number_messages integer,
  max_number_messages integer,
  compulsory character varying(75),
  addressed_to character varying(75),
  category character varying(50)
);


ALTER TABLE c4a_i_schema.template OWNER TO postgres;

--
-- Name: template_has_channel; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE template_has_channel (
  channel_id integer NOT NULL,
  template_id character varying(25) NOT NULL
);


ALTER TABLE c4a_i_schema.template_has_channel OWNER TO postgres;

--
-- Name: template_oid_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE template_oid_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.template_oid_seq OWNER TO postgres;

--
-- Name: template_oid_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE template_oid_seq OWNED BY template.oid;


--
-- Name: user; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE "user" (
  name character varying(25),
  surname character varying(25),
  role character varying(30),
  permission_type character varying(50),
  user_id integer NOT NULL,
  email character varying(50),
  mobilephone_number character varying(25),
  user_id_pretty character varying(50),
  password character varying(65)
);


ALTER TABLE c4a_i_schema."user" OWNER TO postgres;

--
-- Name: user_work_intervention; Type: TABLE; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

CREATE TABLE user_work_intervention (
  user_id integer NOT NULL,
  intervention_session_id integer NOT NULL
);


ALTER TABLE c4a_i_schema.user_work_intervention OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: c4a_i_schema; Owner: postgres
--

CREATE SEQUENCE users_user_id_seq
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;


ALTER TABLE c4a_i_schema.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: c4a_i_schema; Owner: postgres
--

ALTER SEQUENCE users_user_id_seq OWNED BY "user".user_id;


--
-- Name: hour_period_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY hour_period ALTER COLUMN hour_period_id SET DEFAULT nextval('hour_division_hour_division_id_seq'::regclass);


--
-- Name: intervention_session_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY intervention_session ALTER COLUMN intervention_session_id SET DEFAULT nextval('intervention_session_intervention_session_id_seq'::regclass);


--
-- Name: oid; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message ALTER COLUMN oid SET DEFAULT nextval('message_oid_seq'::regclass);


--
-- Name: miniplan_final_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final ALTER COLUMN miniplan_final_id SET DEFAULT nextval('miniplan_final_miniplan_final_id_seq'::regclass);


--
-- Name: miniplan_generated_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated ALTER COLUMN miniplan_generated_id SET DEFAULT nextval('miniplan_generated_miniplan_generated_id_seq'::regclass);


--
-- Name: generated_message_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated_messages ALTER COLUMN generated_message_id SET DEFAULT nextval('miniplan_generated_messages_message_id_seq'::regclass);


--
-- Name: temporary_message_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary_messages ALTER COLUMN temporary_message_id SET DEFAULT nextval('miniplan_temporary_messages_message_id_seq'::regclass);


--
-- Name: oid; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY payoff ALTER COLUMN oid SET DEFAULT nextval('payoff_oid_seq'::regclass);


--
-- Name: permission_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY permission ALTER COLUMN permission_id SET DEFAULT nextval('permission_permission_id_seq'::regclass);


--
-- Name: postdelivery_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY postdelivery_messages ALTER COLUMN postdelivery_id SET DEFAULT nextval('postdelivery_messages_postdelivery_id_seq'::regclass);


--
-- Name: predelivery_message_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY predelivery_messages ALTER COLUMN predelivery_message_id SET DEFAULT nextval('predelivery_messages_predelivery_message_id_seq'::regclass);


--
-- Name: prescription_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY prescription ALTER COLUMN prescription_id SET DEFAULT nextval('prescription_prescription_id_seq'::regclass);


--
-- Name: aged_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile ALTER COLUMN aged_id SET DEFAULT nextval('profile_aged_id_seq'::regclass);


--
-- Name: oid; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY resource ALTER COLUMN oid SET DEFAULT nextval('resource_oid_seq'::regclass);


--
-- Name: subject_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY subject ALTER COLUMN subject_id SET DEFAULT nextval('subjects_subject_id_seq'::regclass);


--
-- Name: oid; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY template ALTER COLUMN oid SET DEFAULT nextval('template_oid_seq'::regclass);


--
-- Name: user_id; Type: DEFAULT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY "user" ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);


--
-- Name: pk.behaviour_messages; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_behaviour_messages
  ADD CONSTRAINT "pk.behaviour_messages" PRIMARY KEY (message_id, aged_id);


--
-- Name: pk_channel; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY channel
  ADD CONSTRAINT pk_channel PRIMARY KEY (channel_id);


--
-- Name: pk_communicativedetails; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_communicative_details
  ADD CONSTRAINT pk_communicativedetails PRIMARY KEY (aged_id);


--
-- Name: pk_frailtystatus; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_frailty_status
  ADD CONSTRAINT pk_frailtystatus PRIMARY KEY (aged_id);


--
-- Name: pk_generatedmessages; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_generated_messages
  ADD CONSTRAINT pk_generatedmessages PRIMARY KEY (generated_message_id, miniplan_generated_id);


--
-- Name: pk_generatedminiplan; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT pk_generatedminiplan PRIMARY KEY (miniplan_generated_id);


--
-- Name: pk_hourperiod; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY hour_period
  ADD CONSTRAINT pk_hourperiod PRIMARY KEY (hour_period_id);


--
-- Name: pk_intervention_session; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY intervention_session
  ADD CONSTRAINT pk_intervention_session PRIMARY KEY (intervention_session_id);


--
-- Name: pk_interventiontemporary; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY intervention_session_temporary
  ADD CONSTRAINT pk_interventiontemporary PRIMARY KEY (intervention_temporary_id);


--
-- Name: pk_manager; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY manager
  ADD CONSTRAINT pk_manager PRIMARY KEY (manager_id);


--
-- Name: pk_message; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY message
  ADD CONSTRAINT pk_message PRIMARY KEY (message_id);


--
-- Name: pk_mgusedbm; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplangenerated_used_behaviourmessages
  ADD CONSTRAINT pk_mgusedbm PRIMARY KEY (miniplan_generate_id, behaviour_message_id);


--
-- Name: pk_mgusedm; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplangenerated_used_messages
  ADD CONSTRAINT pk_mgusedm PRIMARY KEY (miniplan_generated_id, messages_id);


--
-- Name: pk_mhc; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY message_has_channel
  ADD CONSTRAINT pk_mhc PRIMARY KEY (message_id, channel_id);


--
-- Name: pk_mhp; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY message_has_payoff
  ADD CONSTRAINT pk_mhp PRIMARY KEY (message_id, payoff_id);


--
-- Name: pk_mhs; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY message_has_subject
  ADD CONSTRAINT pk_mhs PRIMARY KEY (message_id, subject_id);


--
-- Name: pk_miniplan_behamess; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_used_behaviourmessages
  ADD CONSTRAINT pk_miniplan_behamess PRIMARY KEY (miniplan_id, beahaviour_message_id);


--
-- Name: pk_miniplan_mess; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_used_messages
  ADD CONSTRAINT pk_miniplan_mess PRIMARY KEY (miniplan_id, message_id);


--
-- Name: pk_miniplan_messages; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_final_messages
  ADD CONSTRAINT pk_miniplan_messages PRIMARY KEY (miniplan_message_id, miniplan_id);


--
-- Name: pk_miniplan_temporary; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT pk_miniplan_temporary PRIMARY KEY (miniplan_temporary_id);


--
-- Name: pk_miniplanfinal; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT pk_miniplanfinal PRIMARY KEY (miniplan_final_id);


--
-- Name: pk_minit_behamess; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplantemporary_used_behaviourmessages
  ADD CONSTRAINT pk_minit_behamess PRIMARY KEY (miniplan_temporary_id, behaviour_message_id);


--
-- Name: pk_minit_mess; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplantemporary_used_messages
  ADD CONSTRAINT pk_minit_mess PRIMARY KEY (miniplan_temporary_id, message_id);


--
-- Name: pk_mtmessages; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_temporary_messages
  ADD CONSTRAINT pk_mtmessages PRIMARY KEY (temporary_message_id, miniplan_temporary_id);


--
-- Name: pk_payoff; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY payoff
  ADD CONSTRAINT pk_payoff PRIMARY KEY (payoff_id, resource_id);


--
-- Name: pk_pdm; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY predelivery_messages
  ADD CONSTRAINT pk_pdm PRIMARY KEY (predelivery_message_id);


--
-- Name: pk_permission; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY permission
  ADD CONSTRAINT pk_permission PRIMARY KEY (permission_id);


--
-- Name: pk_pilot; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY pilot_details
  ADD CONSTRAINT pk_pilot PRIMARY KEY (pilot_id);


--
-- Name: pk_postdelivery; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY postdelivery_messages
  ADD CONSTRAINT pk_postdelivery PRIMARY KEY (predelivery_message_id, pilot_id);


--
-- Name: pk_prescription; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY prescription
  ADD CONSTRAINT pk_prescription PRIMARY KEY (prescription_id);


--
-- Name: pk_profile; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile
  ADD CONSTRAINT pk_profile PRIMARY KEY (aged_id);


--
-- Name: pk_profilehourpreferences; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_hour_preferences
  ADD CONSTRAINT pk_profilehourpreferences PRIMARY KEY (aged_id, hour_period_id);


--
-- Name: pk_profilesocioeconomic; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_socioeconomic_details
  ADD CONSTRAINT pk_profilesocioeconomic PRIMARY KEY (aged_id);


--
-- Name: pk_resource; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT pk_resource PRIMARY KEY (resource_id);


--
-- Name: pk_rhm; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY resource_has_messages
  ADD CONSTRAINT pk_rhm PRIMARY KEY (resource_id, message_id);


--
-- Name: pk_rhs; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY resource_has_subjects
  ADD CONSTRAINT pk_rhs PRIMARY KEY (resource_id, subject_id);


--
-- Name: pk_subject; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY subject
  ADD CONSTRAINT pk_subject PRIMARY KEY (subject_id);


--
-- Name: pk_techdetails; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_technical_details
  ADD CONSTRAINT pk_techdetails PRIMARY KEY (aged_id);


--
-- Name: pk_template; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY template
  ADD CONSTRAINT pk_template PRIMARY KEY (template_id);


--
-- Name: pk_thc; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY template_has_channel
  ADD CONSTRAINT pk_thc PRIMARY KEY (channel_id, template_id);


--
-- Name: pk_user; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "user"
  ADD CONSTRAINT pk_user PRIMARY KEY (user_id);


--
-- Name: pk_userwintervention; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY user_work_intervention
  ADD CONSTRAINT pk_userwintervention PRIMARY KEY (user_id, intervention_session_id);


--
-- Name: u_behaviourmessage; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile_behaviour_messages
  ADD CONSTRAINT u_behaviourmessage UNIQUE (message_id);


--
-- Name: u_channel; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY channel
  ADD CONSTRAINT u_channel UNIQUE (channel_id);


--
-- Name: u_generatedminiplan; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT u_generatedminiplan UNIQUE (miniplan_generated_id);


--
-- Name: u_message; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY message
  ADD CONSTRAINT u_message UNIQUE (message_id);


--
-- Name: u_miniplanfinal; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT u_miniplanfinal UNIQUE (miniplan_final_id);


--
-- Name: u_miniplanfinalmessages; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY miniplan_final_messages
  ADD CONSTRAINT u_miniplanfinalmessages UNIQUE (miniplan_message_id);


--
-- Name: u_payoff; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY payoff
  ADD CONSTRAINT u_payoff UNIQUE (payoff_id);


--
-- Name: u_prescription; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY prescription
  ADD CONSTRAINT u_prescription UNIQUE (prescription_id);


--
-- Name: u_profile; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY profile
  ADD CONSTRAINT u_profile UNIQUE (aged_id);


--
-- Name: u_resource; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY resource
  ADD CONSTRAINT u_resource UNIQUE (resource_id);


--
-- Name: u_subject; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY subject
  ADD CONSTRAINT u_subject UNIQUE (subject_id);


--
-- Name: u_subject_name; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY subject
  ADD CONSTRAINT u_subject_name UNIQUE (subject_name);


--
-- Name: u_template; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY template
  ADD CONSTRAINT u_template UNIQUE (template_id);


--
-- Name: u_user; Type: CONSTRAINT; Schema: c4a_i_schema; Owner: postgres; Tablespace:
--

ALTER TABLE ONLY "user"
  ADD CONSTRAINT u_user UNIQUE (user_id);


--
-- Name: create_temp_message; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER create_temp_message AFTER INSERT ON miniplan_generated_messages FOR EACH ROW EXECUTE PROCEDURE temp_mp_messages_from_generated();


--
-- Name: create_temporary; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER create_temporary AFTER INSERT ON miniplan_generated FOR EACH ROW EXECUTE PROCEDURE temp_miniplan_from_generated();


--
-- Name: insert_predelivery; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER insert_predelivery AFTER INSERT ON miniplan_final_messages FOR EACH ROW EXECUTE PROCEDURE insert_into_predeliverymessages();


--
-- Name: update_final_id; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER update_final_id AFTER INSERT ON miniplan_final FOR EACH ROW EXECUTE PROCEDURE update_gen_temp_miniplan_final_id();


--
-- Name: update_predelivery_status; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER update_predelivery_status AFTER UPDATE ON miniplan_final_messages FOR EACH ROW EXECUTE PROCEDURE update_predelivery_status();


--
-- Name: update_status; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER update_status AFTER INSERT ON postdelivery_messages FOR EACH ROW EXECUTE PROCEDURE update_status_after_postdelivery();


--
-- Name: update_temporary_commit; Type: TRIGGER; Schema: c4a_i_schema; Owner: postgres
--

CREATE TRIGGER update_temporary_commit AFTER INSERT ON miniplan_final FOR EACH ROW EXECUTE PROCEDURE update_temporarymp_commit();


--
-- Name: fk_gm_interventionsession; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT fk_gm_interventionsession FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_gm_interventionsession; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated_messages
  ADD CONSTRAINT fk_gm_interventionsession FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_gm_miniplangenerated; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated_messages
  ADD CONSTRAINT fk_gm_miniplangenerated FOREIGN KEY (miniplan_generated_id) REFERENCES miniplan_generated(miniplan_generated_id);


--
-- Name: fk_gm_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT fk_gm_resource FOREIGN KEY (generated_resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_gm_template; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT fk_gm_template FOREIGN KEY (generated_template_id) REFERENCES template(template_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_interventionprescription; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY intervention_session
  ADD CONSTRAINT fk_interventionprescription FOREIGN KEY (prescription_id) REFERENCES prescription(prescription_id);


--
-- Name: fk_interventionprofile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY intervention_session
  ADD CONSTRAINT fk_interventionprofile FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_mf_generated; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT fk_mf_generated FOREIGN KEY (miniplan_generated_id) REFERENCES miniplan_generated(miniplan_generated_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mf_intervention; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT fk_mf_intervention FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_mf_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT fk_mf_resource FOREIGN KEY (final_resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mf_template; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final
  ADD CONSTRAINT fk_mf_template FOREIGN KEY (final_template_id) REFERENCES template(template_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhc_channel; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_channel
  ADD CONSTRAINT fk_mhc_channel FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhc_message; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_channel
  ADD CONSTRAINT fk_mhc_message FOREIGN KEY (message_id) REFERENCES message(message_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhp_message; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_payoff
  ADD CONSTRAINT fk_mhp_message FOREIGN KEY (message_id) REFERENCES message(message_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhp_payoff; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_payoff
  ADD CONSTRAINT fk_mhp_payoff FOREIGN KEY (payoff_id) REFERENCES payoff(payoff_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhs_message; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_subject
  ADD CONSTRAINT fk_mhs_message FOREIGN KEY (message_id) REFERENCES message(message_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mhs_subject; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY message_has_subject
  ADD CONSTRAINT fk_mhs_subject FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mmf_intervention; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_final_messages
  ADD CONSTRAINT fk_mmf_intervention FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_mt_generatedminiplan; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_generatedminiplan FOREIGN KEY (miniplan_generated_id) REFERENCES miniplan_generated(miniplan_generated_id);


--
-- Name: fk_mt_interventionsession; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_interventionsession FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_mt_miniplanfinal; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_miniplanfinal FOREIGN KEY (final_miniplan_id) REFERENCES miniplan_final(miniplan_final_id);


--
-- Name: fk_mt_profile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_profile FOREIGN KEY (aged_id) REFERENCES profile(aged_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mt_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_resource FOREIGN KEY (temporary_resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mt_template; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary
  ADD CONSTRAINT fk_mt_template FOREIGN KEY (temporary_template_id) REFERENCES template(template_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_mtm_intervention; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary_messages
  ADD CONSTRAINT fk_mtm_intervention FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_mtm_miniplan; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_temporary_messages
  ADD CONSTRAINT fk_mtm_miniplan FOREIGN KEY (miniplan_temporary_id) REFERENCES miniplan_temporary(miniplan_temporary_id) ON DELETE CASCADE;


--
-- Name: fk_mubm_bmessage; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_used_behaviourmessages
  ADD CONSTRAINT fk_mubm_bmessage FOREIGN KEY (beahaviour_message_id) REFERENCES profile_behaviour_messages(message_id);


--
-- Name: fk_mubm_miniplan; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_used_behaviourmessages
  ADD CONSTRAINT fk_mubm_miniplan FOREIGN KEY (miniplan_id) REFERENCES miniplan_final(miniplan_final_id);


--
-- Name: fk_mum_miniplan; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_used_messages
  ADD CONSTRAINT fk_mum_miniplan FOREIGN KEY (miniplan_id) REFERENCES miniplan_final(miniplan_final_id);


--
-- Name: fk_payoff_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY payoff
  ADD CONSTRAINT fk_payoff_resource FOREIGN KEY (resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_pbm_profile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_behaviour_messages
  ADD CONSTRAINT fk_pbm_profile FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_pdm_aged; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY predelivery_messages
  ADD CONSTRAINT fk_pdm_aged FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_pdm_message; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY predelivery_messages
  ADD CONSTRAINT fk_pdm_message FOREIGN KEY (miniplan_message_id) REFERENCES miniplan_final_messages(miniplan_message_id);


--
-- Name: fk_pdm_pilot; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY predelivery_messages
  ADD CONSTRAINT fk_pdm_pilot FOREIGN KEY (pilot_id) REFERENCES pilot_details(pilot_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_php_hours; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_hour_preferences
  ADD CONSTRAINT fk_php_hours FOREIGN KEY (hour_period_id) REFERENCES hour_period(hour_period_id);


--
-- Name: fk_php_profile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_hour_preferences
  ADD CONSTRAINT fk_php_profile FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_prescriptionprofile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY prescription
  ADD CONSTRAINT fk_prescriptionprofile FOREIGN KEY (aged_id) REFERENCES profile(aged_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_profile; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY miniplan_generated
  ADD CONSTRAINT fk_profile FOREIGN KEY (aged_id) REFERENCES profile(aged_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_profilecommunicative; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_communicative_details
  ADD CONSTRAINT fk_profilecommunicative FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_profilefrailtystatus; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_frailty_status
  ADD CONSTRAINT fk_profilefrailtystatus FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_profilesocioeconomic; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_socioeconomic_details
  ADD CONSTRAINT fk_profilesocioeconomic FOREIGN KEY (aged_id) REFERENCES profile(aged_id);


--
-- Name: fk_profiletechdetails; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY profile_technical_details
  ADD CONSTRAINT fk_profiletechdetails FOREIGN KEY (aged_id) REFERENCES profile(aged_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_rhm_message; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY resource_has_messages
  ADD CONSTRAINT fk_rhm_message FOREIGN KEY (message_id) REFERENCES message(message_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_rhm_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY resource_has_messages
  ADD CONSTRAINT fk_rhm_resource FOREIGN KEY (resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_rhs_resource; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY resource_has_subjects
  ADD CONSTRAINT fk_rhs_resource FOREIGN KEY (resource_id) REFERENCES resource(resource_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_rhs_subject; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY resource_has_subjects
  ADD CONSTRAINT fk_rhs_subject FOREIGN KEY (subject_id) REFERENCES subject(subject_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_thc_channel; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY template_has_channel
  ADD CONSTRAINT fk_thc_channel FOREIGN KEY (channel_id) REFERENCES channel(channel_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_thc_template; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY template_has_channel
  ADD CONSTRAINT fk_thc_template FOREIGN KEY (template_id) REFERENCES template(template_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: fk_uwi_intervention; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY user_work_intervention
  ADD CONSTRAINT fk_uwi_intervention FOREIGN KEY (intervention_session_id) REFERENCES intervention_session(intervention_session_id);


--
-- Name: fk_uwi_user; Type: FK CONSTRAINT; Schema: c4a_i_schema; Owner: postgres
--

ALTER TABLE ONLY user_work_intervention
  ADD CONSTRAINT fk_uwi_user FOREIGN KEY (user_id) REFERENCES "user"(user_id);


--
-- PostgreSQL database dump complete
--

