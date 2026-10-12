# In-Person Task - Store the Last 5 Currency Conversions

## Overview

**As a user** of the UI currency conversion app  
**I want** to be able to view a list of my last 5 currency conversions  
**So that** I can quickly reference recent conversions without having to redo them.

## Acceptance Criteria

The list should show a maximum of 5 most recent currency conversions.
New conversions should be added to the top of the list.
If the list already contains 5 conversions, the oldest conversion should be removed from the bottom of the list to make space for the new one.

## Non-Functional Requirements

### Usability

The list of conversions should be easily accessible from the main screen.
Entries should be displayed in a clear and readable format.
The from, to, amount to convert, and the API-derived conversion value should all be present.

### Scalability

Although the current requirement is to store only the last 5 conversions, the design should be flexible enough to allow easy adjustments to this number in the future if needed.
