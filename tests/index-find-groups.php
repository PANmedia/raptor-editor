<?php
$warnings = [];  // An array to hold all of the warnings found when the csv file is parsed.
$groups = [];    // An array of all the groups.
$group_csv_data = []; // An array which holds all the raw group information.
$csv_data = []; // An array which holds all the raw test information.


$csv_total_file_content = file_get_contents(__DIR__ . '/tests.csv'); // Gets the content of the tests file.
$total_lines = explode("\n", $csv_total_file_content); // Splits the content up based on where the new lines are.
$total_head = str_getcsv(array_shift($total_lines)); // Gets the keys for the raw data array from the header cells.

// For each line combine the keys and the information to create an element of total row data,
// If the filename of the new element is empty then add it to the group csv data array,
// Otherwise add it to the tests csv data.
foreach ($total_lines as $total_line) {
    $total_row_data = array_combine($total_head, str_getcsv($total_line));
    if (trim($total_row_data['File Name']) === '') {
        $group_csv_data[$total_row_data['Folder']] = $total_row_data;
    } else {
        $csv_data[$total_row_data['Folder'] . '/' . $total_row_data['File Name']] = $total_row_data;
    }
}

// Gets the tests for a supplied group ($case) using the test csv data.
$findTests = function($case) use($csv_data, &$warnings) {
    $tests = [];
    // For each file that has the same folder name as the $case supplied,
    // Set the index to be the folder/filename.
    foreach (glob($case . '/*.*') as $file) {
        $index = basename($case) . '/' . basename($file);

        // Check if there is a description for the test,
        // If no description then add its particulars to the warnings array.
        if (!isset($csv_data[$index]["Description"])) {
            $warnings[] = 'No description found for: ' . $index;
            continue;
        }

        // Add the test to the tests array.
        $tests[] = [
            'name' => $csv_data[$index]['Name'],
            'filename' => basename($file),
            'description' => $csv_data[$index]['Description'],
        ];
    }
    return $tests; // Return the tests for that group.
};

// For each folder in the cases  directory,
// Set the index to be the folder name.
foreach (glob(__DIR__ . '/cases/*') as $case) {
    $index = basename($case);

    // Check if there is a description for the group
    // If there is no description then add its particulars to the warnings array.
    if (!isset($group_csv_data[$index]['Description'])) {
        $warnings[] = 'No description found for: ' . $index;
        continue;
    }

    // Add the group to the groups array using the findTests method to get the tests.
    $groups[] = [
        'name' => $group_csv_data[$index]['Name'],
        'path' => basename($case),
        'description' => $group_csv_data[$index]['Description'],
        'tests' => $findTests($case),
    ];
}
