CREATE OR REPLACE VIEW "public"."newest_result" AS 
 SELECT results.date,
    results."player1Id",
    results."player2Id",
    results.player1goals,
    results.player2goals,
    results."communityId",
    results.id,
    results.comment,
    results.extratime
   FROM results
  WHERE (results.id = ( SELECT max(results_1.id) AS max
           FROM results results_1));
