# c4a-DBmanager
The description of the database manager contains an example of a API call, and the list of methods 

## EXAMPLE
In order to retrieve the resource with resource_id = "Res1" ==> Call the API as: 

> http://..../endpoint/getResource/Res1

## LIST OF METHODS

### GET METHODS 
The parameter specified between the brackest is the one that needs to be specified

**PROFILE**
- getProfile        *(profile_id)*
- getProfileTechnicalDetails        *(profile_id)*             
- getProfileCommunicativeDetails        *(profile_id)*
- getProfileSocioeconomicDetails        *(profile_id)*
- getProfileFrailtyStatus       *(profile_id)*
- getProfileHourPreferences     *(profile_id)*
    
**PRESCRIPTION**
- getPrescription    *(prescription_id)*
- getAllPrescriptions    *(profile_id)*
    
**INTERVENTION**
- getIntervention       *(intervention_id)*
- getAllInterventions       *(profile_id)*
- getInterventionTemporary      *(intervention_id)*
- getInterventionFromPrescription       *(prescription_id)*
    
**RESOURCE**
- getResource       *(resource_id)*
- getAllResources       *(none)*
- getAllResourcesOfIntervention     *(intervention_id)*
- getResourceMessages       *(resource_id)*
    
**TEMPLATE**
- getAllTemplates       *(none)*
- getTemplate       *(template_id)*
- getTemplatesForResource       *(resource_id)*
  
**MINIPLAN**
- getMiniplanFinalFromData 
- getMiniplanGenerated      *(miniplan_generated_id)*
- getMiniplanTemporary      *(miniplan_temporary_id)*
- getMiniplanFinal      *(miniplan_final_id)*
- getMiniplanGeneratedMessages      *(miniplan_generated_id)*
- getMiniplanTemporaryMessages      *(miniplan_temporary_id)*
- getMiniplanFinalMessages      *(miniplan_final_id)*
- getAllProfileMiniplanFinalMessages        *(profile_id)*
    
**USER**
- getUser       *(user_id)*
- getUserOfIntervention *(intervention_id)*
   
   
### POST METHODS
The first parameter is to be used as in the example call provided above. The others are the keys-values parameters that need to be specified. 

**PROFILE**
- setUserAttention  *(profile_id)*  --- *(frailty_attention)*
- setUserFrailtyStatus  *(profile_id)* --- *(status_text)*, *(status_number)*. Either one of the two or both can be specified.
- setUserFrailtyStatusOverall  *(profile_id)* --- *(status_overall)*
- setUserFrailtyStatusLastperiod  *(profile_id)* --- *(status_lastperiod)*
    
**PRESCRIPTION**
- setNewPrescription  *(none)* --- *(aged_id)*, *(geriatrician_id)*, *(prescription_text)*, *(prescription_urgency)*, *(prescription_title)*. OPTIONAL: *(additional_notes)* 
- editPrescription  *(prescription_id)* --- *(aged_id)*, *(geriatrician_id)*, *(prescription_text)*, *(prescription_urgency)*, *(prescription_status)*
- updatePrescriptionStatus  *(prescription_id)* --- *(prescription_statuts)* 
- updatePrescriptionUrgency  *(prescription_id)* --- *(prescription_urgency)*
    
**INTERVENTION**
- setNewIntervention  *(none)* --- *(aged_id)*, *(intervention_status)*, *(prescription_id)*, *(intervention_title)*. OPTIONAL: *(from_date)* AND *(to_date)*. If from_date (to_date) is specified also to_date (from_date) needs to be specified.
- setTemporaryIntervention  *(intervention_id)* --- *(temp_resources)*, *(temp_template)*. Either one of the two or both can be specified.
- updateInterventionStatus  *(intervention_id)* --- *(intervention_status)*
- updateInterventionConfirmedCaregiver  *(intervention_id)* --- *(confirmed_caregiver_id)*
- updateInterventionPrescription  *(intervention_id)* --- *(intervention_prescription_id)*
- updateInterventionDates  *(intervention_id)* --- *(from_date)*, *(to_date)*. Either one of the two or both can be specified.

**MINIPLAN**
- setNewMiniplanGenerated  *(none)* --- *(generation_date)*, *(from_date)*, *(to_date)*, *(resource_id)*, *(template_id)*, *(intervention_id)*. OPTIONAL: *(miniplan_body)* 
- setNewMiniplanGeneratedMessage  *(none)* --- *(time_prescription)*, *(channel)*, *(generation_date)*, *(message_body)*, *(miniplan_id)*, *(intervention_id)*
- setNewMiniplanTemporary  *(none)* --- *(save_date)*, *(from_date)*, *(to_date)*, *(resource_id)*, *(template_id)*, *(intervention_id)*. OPTIONAL: *(miniplan_body)*
- setNewMiniplanTemporaryMessage  *(none)* --- *(time_prescription)*, *(channel)*, *(message_body)*, *(miniplan_id)*, *(intervention_id)*
- setNewMiniplanFinal  *(none)* --- *(commit_date)*, *(from_date)*, *(to_date)*, *(resource_id)*, *(template_id)*, *(intervention_id)*, *(caregiver_id)*, *(generated_miniplan_id)*. OPTIONAL: *(miniplan_body)*
- setNewMiniplanFinalMessage  *(none)* --- *(time_prescription)*, *(channel)*, *(is_modified)*, *(message_body)*, *(miniplan_id)*, *(intervention_id)*



