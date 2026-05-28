import React, { createContext, useContext, useState } from 'react';
import { IProductService, ProductService } from '../core/ProductService';
import { IAuthService, AuthService } from '../core/AuthService';
import { IOrderService, OrderService } from '../core/OrderService';
import { mockProducts, mockCategories, mockOrders } from '../mockData';

// Dependency Injection Container via React Context
interface ServiceContextType {
  productService: IProductService;
  authService: IAuthService;
  orderService: IOrderService;
}

const services: ServiceContextType = {
  productService: new ProductService(mockProducts, mockCategories),
  authService: new AuthService(),
  orderService: new OrderService(mockOrders),
};

const ServiceContext = createContext<ServiceContextType>(services);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => useContext(ServiceContext);
