SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: import_messages(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

DROP FUNCTION c4a_i_schema.import_messages(file_path character varying) CASCADE;

CREATE FUNCTION c4a_i_schema.import_messages(file_path character varying) RETURNS void
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
FROM %L WITH DELIMITER ',' CSV HEADER$$, $1);

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
ALTER FUNCTION c4a_i_schema.import_messages(file_path character varying) SECURITY DEFINER;

--
-- Name: import_prescriptions(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

DROP FUNCTION c4a_i_schema.import_prescriptions(file_path character varying) CASCADE;

CREATE FUNCTION c4a_i_schema.import_prescriptions(file_path character varying) RETURNS void
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
FROM %L WITH DELIMITER ',' CSV HEADER$$, $1);

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
ALTER FUNCTION c4a_i_schema.import_prescriptions(file_path character varying) SECURITY DEFINER;

--
-- Name: import_profile_communicative_details(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--

DROP FUNCTION c4a_i_schema.import_profile_communicative_details(file_path character varying) CASCADE;

CREATE FUNCTION c4a_i_schema.import_profile_communicative_details(file_path character varying) RETURNS void
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
FROM %L WITH DELIMITER ',' CSV HEADER$$, $1);

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
ALTER FUNCTION c4a_i_schema.import_profile_communicative_details(file_path character varying) SECURITY DEFINER;

--
-- Name: import_resources(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--
DROP FUNCTION c4a_i_schema.import_resources(file_path character varying) CASCADE;

CREATE FUNCTION c4a_i_schema.import_resources(file_path character varying) RETURNS void
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
FROM %L WITH DELIMITER ',' CSV HEADER$$, $1);

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
ALTER FUNCTION c4a_i_schema.import_resources(file_path character varying) SECURITY DEFINER;

--
-- Name: import_templates(character varying); Type: FUNCTION; Schema: c4a_i_schema; Owner: postgres
--
DROP FUNCTION c4a_i_schema.import_templates(file_path character varying) CASCADE;

CREATE FUNCTION c4a_i_schema.import_templates(file_path character varying) RETURNS void
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
FROM %L WITH DELIMITER ',' CSV HEADER$$, $1);

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
ALTER FUNCTION c4a_i_schema.import_templates(file_path character varying) SECURITY DEFINER;


