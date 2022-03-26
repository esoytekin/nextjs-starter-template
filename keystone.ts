import { config, list } from '@keystone-6/core';
import { text } from '@keystone-6/core/fields';

const lists = {
    User: list({
        fields: {
            email: text({
                validation: {
                    isRequired: true,
                },
                isIndexed: 'unique',
            }),
            password: text({
                validation: {
                    isRequired: true,
                },
            }),
        },
    }),
};

export default config({
    db: {
        provider: 'sqlite',
        url: 'file:./keystone.db',
    },
    lists,
    experimental: {
        generateNextGraphqlAPI: true,
        generateNodeAPI: true,
    },
});
