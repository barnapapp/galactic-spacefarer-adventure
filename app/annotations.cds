using SpacefarerService from '../srv/spacefarer-service';

annotate SpacefarerService.Spacefarers with {
    ID @title: 'ID';
    name @title: 'Name';
    email @title: 'Email';
    originPlanet @title: 'Origin Planet';
    stardustCollection @title: 'Stardust Collection';
    wormholeNavigationSkill @title: 'Wormhole Navigation Skill';
    spacesuitColor @title: 'Spacesuit Color';
    status @title: 'Status';
    department @title: 'Department' @Common.Text: department.name @Common.TextArrangement: #TextOnly;
    position @title: 'Position' @Common.Text: position.title @Common.TextArrangement: #TextOnly;
}

annotate SpacefarerService.Spacefarers with @(
    UI.SelectionFields: [
        originPlanet,
        spacesuitColor,
        status,
        wormholeNavigationSkill
    ],
    UI.LineItem: [
        { Value: name, Label: 'Name' },
        { Value: originPlanet, Label: 'Origin Planet' },
        { Value: stardustCollection, Label: 'Stardust Collection' },
        { Value: wormholeNavigationSkill, Label: 'Wormhole Skill' },
        { Value: spacesuitColor, Label: 'Spacesuit Color' },
        { Value: status, Label: 'Status' }
    ],
    UI.HeaderInfo: {
        TypeName : 'Spacefarer',
        TypeNamePlural : 'Spacefarers',
        Title : { Value: name },
        Description : { Value: originPlanet }
    },
    UI.Facets: [
        {
          $Type : 'UI.ReferenceFacet',
          Label : 'Cosmic Details',
          Target : '@UI.FieldGroup#CosmicDetails'
        },
        {
          $Type : 'UI.ReferenceFacet',
          Label : 'Assignment',
          Target : '@UI.FieldGroup#Assignment'
        }
    ],
    UI.FieldGroup#CosmicDetails: {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Value: name, Label: 'Name' },
            { Value: stardustCollection, Label: 'Stardust Collection' },
            { Value: wormholeNavigationSkill, Label: 'Wormhole Navigation Skill' },
            { Value: spacesuitColor, Label: 'Spacesuit Color' },
            { Value: status, Label: 'Status' }
        ]
    },
    UI.FieldGroup#Assignment: {
        $Type : 'UI.FieldGroupType',
        Data : [
            { Value: email, Label: 'Email' },
            { Value: originPlanet, Label: 'Origin Planet' },
            { Value: department_ID, Label: 'Department' },
            { Value: position_ID, Label: 'Position' }
        ]
    }
);