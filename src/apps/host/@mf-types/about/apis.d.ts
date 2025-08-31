
    export type RemoteKeys = 'about/App';
    type PackageType<T> = T extends 'about/App' ? typeof import('about/App') :any;