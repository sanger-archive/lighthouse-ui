// List of example plates to use in testing.
/**
 * The filtered positive samples and the priority samples are two distinct sets
 */
const plateA = {
  plate_barcode: 'AP-rna-0-2-8-6',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 2,
  count_fit_to_pick_samples: 8,
  count_filtered_positive: 6,
}
/**
 * The filtered positive samples and the priority samples are two distinct sets
 */
const plateB = {
  plate_barcode: 'AP-rna-0-1-2-1',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 1,
  count_fit_to_pick_samples: 2,
  count_filtered_positive: 1,
}
/**
 * No plate map data
 */
const plateC = {
  plate_barcode: 'AP-rna-no_map',
  has_plate_map: false,
  count_fit_to_pick_samples: 0,
  count_must_sequence: 0,
  count_preferentially_sequence: 0,
  count_filtered_positive: 0,
}
/**
 * The priority samples are a subset of the filtered positive samples
 */
const plateD = {
  plate_barcode: 'AP-rna-1-1-5-5',
  has_plate_map: true,
  count_must_sequence: 1,
  count_preferentially_sequence: 1,
  count_fit_to_pick_samples: 5,
  count_filtered_positive: 5,
}
/**
 * Plate map data is present but no fit to pick samples for the plate
 */
const plateE = {
  plate_barcode: 'AP-rna-0-0-0-0',
  has_plate_map: true,
  count_must_sequence: 0,
  count_preferentially_sequence: 0,
  count_fit_to_pick_samples: 0,
  count_filtered_positive: 0,
}
/**
 * The filtered positive samples and the priority samples are two distinct sets
 */
const plateF = {
  plate_barcode: 'AP-rna-2-0-10-8',
  has_plate_map: true,
  count_must_sequence: 2,
  count_preferentially_sequence: 0,
  count_fit_to_pick_samples: 10,
  count_filtered_positive: 8,
}

export { plateA, plateB, plateC, plateD, plateE, plateF }
