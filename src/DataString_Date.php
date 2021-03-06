<?php

class DataString_Date extends DataString {
	//
	// A list of conversion patterns, each an array with two items
	//   where first item is regex and second is replacement string
	// Add, remove or splice a patterns to customize date parsing ability
	//
	// among others, DateTime constructor can safely handle:
	//   Mar 15, 2010
	//   March 15, 2010
	//   3/15/2010
	//   03/15/2010
	//
	//   pattern for year 1000 through 9999: ([1-9]\d{3})
	//   pattern for month number: (1[0-2]|0\d|\d)
	//   pattern for month name: (?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)
	//   pattern for day of month: (3[01]|[0-2]\d|\d)
	public $parsers = array(
		// 3/15/2010
		array('/(1[0-2]|0\d|\d)\s*\/\s*(3[01]|[0-2]\d|\d)\s*\/\s*([1-9]\d{3})/', '$1/$2/$3'),
		// 2010-03-15
		array('/([1-9]\d{3})\s*-\s*(1[0-2]|0\d|\d)\s*-\s*(3[01]|[0-2]\d|\d)/', '$2/$3/$1'),
		// 3-15-2010
		array('/(1[0-2]|0\d|\d)\s*[\/-]\s*(3[01]|[0-2]\d|\d)\s*[\/-]\s*([1-9]\d{3})/', '$1/$2/$3'),
		// 15-Mar-2010
		array('/(3[01]|[0-2]\d|\d)\s*[ -]\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s*[ -]\s*([1-9]\d{3})/i', '$2 $1, $3'),
		// March 15, 2010
		array('/(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*)\s+(3[01]|[0-2]\d|\d),?\s*([1-9]\d{3})/i', '$2 $1, $3'),
		// 15.03.2010
		array('/(3[01]|[0-2]\d|\d)\s*\.\s*(1[0-2]|0\d|\d)\s*\.\s*([1-9]\d{3})/', '$2/$1/$3'),
	);
	
	public $date;
	
	public function setValue($date) {
		$this->raw = $date;
		$this->date = null;
		if (strlen($this->raw)) {
			foreach ($this->parsers as $parser) {
				if (!preg_match($parser[0], $date)) {
					continue;
				}
				try {
					$this->date = new DateTime(preg_replace($parser[0], $parser[1], $date));
				}
				catch(Exception $e) {
					// invalid or unknown date
				}
			}
		}
		return $this;
	}

	public function isValid() {
		return !!$this->date;
	}

	public function format() {
		if (!$this->isValid()) {
			return '';
		}
		return $this->date->format('Y-m-d');
	}

	public function valueOf() {
		return $this->date ? $this->date : '';
	}

}
