import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavigationContextType = {
  navigationPath: string | null;
  navigateTo: (path: string) => void;
};

const NavigationContext = createContext<NavigationContextType>({
  navigationPath: null,
  navigateTo: () => {},
});

type NavigationProviderProps = {
  children: ReactNode;
};

export const NavigationProvider = ({ children }: NavigationProviderProps): React.ReactElement => {
  const [navigationPath, setNavigationPath] = useState<string | null>(null);

  const navigateTo = (path: string) => {
    setNavigationPath(path);
  };

  return (
    <NavigationContext.Provider value={{ navigateTo, navigationPath }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  return useContext(NavigationContext);
};