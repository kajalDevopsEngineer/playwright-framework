import { APIRequestContext } from '@playwright/test';
import { withRetry } from '../utils/retryUtils';

export class APIClient {
  private request: APIRequestContext;
  private readonly baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL =
      baseURL || 'https://opensource-demo.orangehrmlive.com';
  }

  async getEmployees(): Promise<any[]> {
    return withRetry(
      async () => {
        const response = await this.request.get(
          `${this.baseURL}/web/index.php/api/v2/pim/employees`,
          { headers: { Accept: 'application/json' } }
        );

        console.log(`Get employees status: ${response.status()}`);

        if (!response.ok()) {
          const body = await response.text();
          console.log('Response body:', body.substring(0, 300));
          throw new Error(`Get employees failed: ${response.status()}`);
        }

        const body = await response.json();
        return body.data ?? [];
      },
      {
        attempts: 3,
        delayMs: 2000,
        description: 'GET /employees',
      }
    );
  }

  async getEmployeeById(id: number): Promise<any> {
    const response = await this.request.get(
      `${this.baseURL}/web/index.php/api/v2/pim/employees/${id}`,
      { headers: { Accept: 'application/json' } }
    );

    if (!response.ok()) {
      throw new Error(`Get employee ${id} failed: ${response.status()}`);
    }

    const body = await response.json();
    return body.data;
  }

  async createEmployee(
    firstName: string,
    lastName: string,
    employeeId: string
  ): Promise<any> {
    const response = await this.request.post(
      `${this.baseURL}/web/index.php/api/v2/pim/employees`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: { firstName, lastName, employeeId },
      }
    );

    console.log(`Create employee status: ${response.status()}`);

    if (!response.ok()) {
      const body = await response.text();
      console.log('Create employee error:', body.substring(0, 300));
      throw new Error(`Create employee failed: ${response.status()}`);
    }

    const body = await response.json();
    console.log('Created employee:', JSON.stringify(body.data, null, 2));
    return body.data;
  }

  async deleteEmployee(empNumber: number): Promise<void> {
    const response = await this.request.delete(
      `${this.baseURL}/web/index.php/api/v2/pim/employees`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        data: { ids: [empNumber] },
      }
    );

    console.log(`Delete employee status: ${response.status()}`);

    if (response.status() === 404) {
      console.log(`Employee ${empNumber} already deleted — skipping`);
      return;
    }

    if (!response.ok()) {
      const body = await response.text();
      console.log('Delete employee error:', body.substring(0, 300));
      throw new Error(`Delete employee failed: ${response.status()}`);
    }

    console.log(`Employee ${empNumber} deleted successfully`);
  }
}