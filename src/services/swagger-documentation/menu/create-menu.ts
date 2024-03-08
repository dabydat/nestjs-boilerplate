import { ApiBody } from '@nestjs/swagger';
import { CreateMenuDto } from 'src/modules/security/menu/dto/create-menu.dto';

export const createMenuApiBody = ApiBody({
    type: () => CreateMenuDto, examples: {
        'menu': {
            value:
                [
                    {
                        "name": "Menu 1",
                        "isParent": true,
                        "order": 1,
                        "isActive": true,
                        "children": [
                            {
                                "name": "Submenu 1.1",
                                "isParent": true,
                                "order": 1,
                                "isActive": true,
                                "children": [
                                    {
                                        "name": "Sub-Submenu 1.1.1",
                                        "isParent": true,
                                        "order": 1,
                                        "isActive": true,
                                        "children": [
                                            {
                                                "name": "Sub-Sub-Submenu 1.1.1.1",
                                                "isParent": false,
                                                "toLink": "/link-to-somewhere",
                                                "order": 1,
                                                "isActive": true
                                            },
                                            {
                                                "name": "Sub-Sub-Submenu 1.1.1.2",
                                                "isParent": false,
                                                "toLink": "/link-to-somewhere-else",
                                                "order": 2,
                                                "isActive": true
                                            }
                                        ]
                                    },
                                    {
                                        "name": "Sub-Submenu 1.1.2",
                                        "isParent": false,
                                        "toLink": "/another-link",
                                        "order": 2,
                                        "isActive": true
                                    }
                                ]
                            },
                            {
                                "name": "Submenu 1.2",
                                "isParent": false,
                                "toLink": "/yet-another-link",
                                "order": 2,
                                "isActive": true
                            }
                        ]
                    },
                    {
                        "name": "Menu 2",
                        "isParent": true,
                        "order": 2,
                        "isActive": true,
                        "children": [
                            {
                                "name": "Submenu 2.1",
                                "isParent": false,
                                "toLink": "/link-to-somewhere",
                                "order": 1,
                                "isActive": true
                            }
                        ]
                    },
                    {
                        "name": "Menu 3",
                        "isParent": false,
                        "toLink": "/another-link",
                        "order": 3,
                        "isActive": true
                    }
                ]
        }
    }
});