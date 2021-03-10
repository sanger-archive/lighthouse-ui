// List of example plates to use in testing.
const plateA = {
  plate_barcode: 'AP-rna-0-2-8-6',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 2,
  count_fit_to_pick_samples: 8,
  count_filtered_positive: 6,
}
const plateB = {
  plate_barcode: 'AP-rna-0-1-2-1',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 1,
  count_fit_to_pick_samples: 2,
  count_filtered_positive: 1,
}
const plateC = {
  plate_barcode: 'AP-rna-no_map',
  has_plate_map: false,
  count_fit_to_pick_samples: 0,
  count_must_sequence: 0,
  count_preferentially_sequence: 0,
  count_filtered_positive: 0,
}
const plateD = {
  plate_barcode: 'AP-rna-1-1-5-0',
  has_plate_map: true,
  count_must_sequence: 1,
  count_preferentially_sequence: 1,
  count_fit_to_pick_samples: 5,
  count_filtered_positive: 0,
}
const plateE = {
  plate_barcode: 'AP-rna-0-1-0-1',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 1,
  count_fit_to_pick_samples: 0,
  count_filtered_positive: 1,
}
const plateF = {
  plate_barcode: 'AP-rna-2-0-10-8',
  has_plate_map: true,
  count_must_sequence: 2,
  count_preferentially_sequence: 0,
  count_fit_to_pick_samples: 10,
  count_filtered_positive: 8,
}

export { plateA, plateB, plateC, plateD, plateE, plateF }
