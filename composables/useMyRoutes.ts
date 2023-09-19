
type userRoutes = "admin" | "waiter" | "finance" | "chef" | "store" ;

export  {userRoutes};
export default function useMyRoutes() {
  interface IRoutesOps {
    admin: Array<number>;
    waiter: Array<number>;
    finance: Array<number>;
    chef: Array<number>;
    store: Array<number>;
  }
  interface MyRoutes {
    icon: string;
    name: string;
    path: string;
  }
  const state = reactive<{
    routes: { [key: number]: MyRoutes } ;
    routesOps: IRoutesOps;
  }>({
    routes: {
      // Define las rutas con sus iconos, nombres y rutas
      1: {
        icon: "👥",
        name: "Manejo de usuarios",
        path: "/user-manager",
      },
      2: {
        icon: "🪑",
        name: "Mesas",
        path: "/tables",
      },
      3: {
        icon: "🍽️",
        name: "Mesero",
        path: "/waiter",
      },
      4: {
        icon: "📈",
        name: "Finanzas",
        path: "/finance",
      },
      5: {
        icon: "👨🏻‍🍳",
        name: "Chef",
        path: "/chef",
      },
      6: {
        icon: "📊",
        name: "Dashboard",
        path: "/dashboard-store",
      },
      7: {
        icon: "🥝",
        name: "Ingredientes",
        path: "/ingredients",
      },
    },
    routesOps: {
      // Define opciones de rutas para diferentes tipos de usuarios
      "admin": [1,2,3,4,5,6,7],
      "waiter": [2, 3],
      "finance": [4],
      "chef": [5],
      "store": [7],
    },
  });


  // Define una función para obtener las rutas según el tipo de usuario
  const getMyRoutes = (userType: userRoutes): Array<MyRoutes> =>
    state.routesOps[userType].reduce((ac, cu) => {
      ac.push(state.routes[cu]);
      return ac;
    }, []);

  return {
    res: state.routesOps,
    getMyRoutes,
  };
}
