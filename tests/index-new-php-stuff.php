<?php

    $warnings = [];
    $groups = [];
    $group_csv_data = [];
    $csv_data = [];


    $csv_total_file_content = file_get_contents('tests.csv');
    $total_lines = explode("\n", $csv_total_file_content);
    $total_head = str_getcsv(array_shift($total_lines));

    foreach ($total_lines as $total_line) {
        $total_row_data = array_combine($total_head, str_getcsv($total_line));
        if (trim($total_row_data['File Name']) === '') {
            $group_csv_data[$total_row_data['Folder']] = $total_row_data;
        } else {
            $csv_data[$total_row_data['Folder'] . '/' . $total_row_data['File Name']] = $total_row_data;
        }
    }

    $findTests = function($case) use($csv_data, &$warnings) {
        $tests = [];
        foreach (glob($case . '/*.*') as $file) {
            $index = basename($case) . '/' . basename($file);
            if (!isset($csv_data[$index]["Description"])) {
                $warnings[] = 'No description found for: ' . $index;
                continue;
            }
            $tests[] = [
                'name' => $csv_data[$index]['Name'],
                'filename' => basename($file),
                'description' => $csv_data[$index]['Description'],
            ];
        }
        return $tests;
    };

    foreach (glob(__DIR__ . '/cases/*') as $case) {
        $index = basename($case);
        if (!isset($group_csv_data[$index]['Description'])) {
            $warnings[] = 'No description found for: ' . $index;
            continue;
        }
        $groups[] = [
            'name' => $group_csv_data[$index]['Name'],
            'path' => basename($case),
            'description' => $group_csv_data[$index]['Description'],
            'tests' => $findTests($case),
        ];
    }
?>
