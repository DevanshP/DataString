<?php

class DataString_Dollars extends DataString_Number {

	public function format($round = false) {
		return '$' . number_format($this->valueOf(), $round ? 0 : 2);
	}

	public function valueOf() {
		return (float) preg_replace('/[^\d.-]/', '', $this->raw);
	}

}