import React, { useContext, useMemo, useRef } from "react";

type IdGenerator = () => string;
type IdGeneratorFactory = (prefix: string) => IdGenerator;

class UniqueIdFactory {
  private idGeneratorFactory: IdGeneratorFactory;

  private idGenerators: { [key: string]: IdGenerator } = {};

  constructor() {
    this.idGeneratorFactory = (prefix) => {
      let index = 1;
      return () => `P2P${prefix}${index++}`;
    };
  }

  nextId(prefix: string) {
    if (!this.idGenerators[prefix]) {
      this.idGenerators[prefix] = this.idGeneratorFactory(prefix);
    }

    return this.idGenerators[prefix]();
  }
}

const UniqueIdFactoryContext = React.createContext<UniqueIdFactory | undefined>(undefined);

export const UniqueIdProvider = ({ children }: { children: React.ReactNode }) => {
  const factory = useMemo(() => new UniqueIdFactory(), []);
  return <UniqueIdFactoryContext.Provider value={factory}>{children}</UniqueIdFactoryContext.Provider>;
};

export function useUniqueId(prefix = "", idOverride: string | undefined = undefined) {
  const idFactory = useContext(UniqueIdFactoryContext);

  const uniqueIdRef = useRef<string | null>(idOverride ? idOverride : null);

  if (!idFactory) {
    throw new Error("No UniqueIdFactory was provided.");
  }

  if (!uniqueIdRef.current) {
    uniqueIdRef.current = idFactory.nextId(prefix);
  }

  return uniqueIdRef.current;
}
