<?php
/**
 * This script is used to retrieve contributions list of an account because no
 * official API let you retrieve thoses informations easily.
 */

setlocale(LC_ALL, 'fr_FR');

$github_stats = file_get_contents('https://github.com/users/resilva/contributions_calendar_data');
$github_stats = json_decode($github_stats);

$monthly_stats = array();

foreach ($github_stats as $stat) {
    $day = $stat[0];
    $commits = $stat[1];

    $date = DateTime::createFromFormat('Y-m-d', $day);

    if (!isset($monthly_stats[$date->format('Y')])) {
        $monthly_stats[$date->format('Y')] = array();
    }

    if (!isset($monthly_stats[$date->format('Y')][$date->format('m')])) {
        $monthly_stats[$date->format('Y')][$date->format('m')] = 0;
    }

    $monthly_stats[$date->format('Y')][$date->format('m')] += $commits;
}

file_put_contents('data/scripts/github_stats.json', json_encode($monthly_stats));
