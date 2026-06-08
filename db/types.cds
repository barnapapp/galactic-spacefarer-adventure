@assert.range
type SpacesuitColor : String(20) enum {
    RED = 'RED';
    BLUE = 'BLUE';
    GREEN = 'GREEN';
    GOLD = 'GOLD';
    SILVER = 'SILVER';
    COSMIC_BLACK = 'COSMIC_BLACK';
}

@assert.range
type SpacefarerStatus : String(20) enum {
    CANDIDATE = 'CANDIDATE';
    TRAINING = 'TRAINING';
    ACTIVE = 'ACTIVE';
    RETIRED = 'RETIRED';
}